use std::fmt::Display;

use neon::prelude::*;
use tree_sitter_highlight::{HighlightConfiguration, HighlightEvent, Highlighter};

#[neon::main]
pub fn init(mut cx: ModuleContext<'_>) -> NeonResult<()> {
    cx.export_function("highlight", highlight)?;
    Ok(())
}

fn highlight(mut cx: FunctionContext<'_>) -> JsResult<'_, JsArray> {
    let src = cx.argument::<JsString>(0)?.value(&mut cx);
    let lang = cx.argument::<JsString>(1)?.value(&mut cx).to_lowercase();

    let mut ts = HighlightConfiguration::new(
        tree_sitter_typescript::language_typescript(),
        &[
            tree_sitter_typescript::HIGHLIGHT_QUERY,
            tree_sitter_javascript::HIGHLIGHT_QUERY,
        ]
        .join(""),
        tree_sitter_javascript::INJECTION_QUERY,
        &[
            tree_sitter_typescript::LOCALS_QUERY,
            tree_sitter_javascript::LOCALS_QUERY,
        ]
        .join(""),
    )
    .js(&mut cx)?;
    let names = ts.query.capture_names().to_vec();
    ts.configure(&names);

    let mut tsx = HighlightConfiguration::new(
        tree_sitter_typescript::language_tsx(),
        &[
            tree_sitter_javascript::JSX_HIGHLIGHT_QUERY,
            tree_sitter_typescript::HIGHLIGHT_QUERY,
            tree_sitter_javascript::HIGHLIGHT_QUERY,
        ]
        .join(""),
        tree_sitter_javascript::INJECTION_QUERY,
        &[
            tree_sitter_typescript::LOCALS_QUERY,
            tree_sitter_javascript::LOCALS_QUERY,
        ]
        .join(""),
    )
    .js(&mut cx)?;
    let names = tsx.query.capture_names().to_vec();
    tsx.configure(&names);

    let mut rs = HighlightConfiguration::new(
        tree_sitter_rust::language(),
        tree_sitter_rust::HIGHLIGHT_QUERY,
        "",
        "",
    )
    .js(&mut cx)?;
    let names = rs.query.capture_names().to_vec();
    rs.configure(&names);

    let mut c = HighlightConfiguration::new(
        tree_sitter_c::language(),
        tree_sitter_c::HIGHLIGHT_QUERY,
        "",
        "",
    )
    .js(&mut cx)?;
    let names = c.query.capture_names().to_vec();
    c.configure(&names);

    let mut x86 = HighlightConfiguration::new(
        tree_sitter_x86asm::language(),
        tree_sitter_x86asm::HIGHLIGHTS_QUERY,
        "",
        "",
    )
    .js(&mut cx)?;
    let names = x86.query.capture_names().to_vec();
    x86.configure(&names);

    let cfg = match lang.as_str() {
        "ts" | "typescript" => ts,
        "tsx" => tsx,
        "rs" | "rust" => rs,
        "c" => c,
        "x86" => x86,
        _ => return cx.throw_error("unsupported language"),
    };

    let mut highlighter = Highlighter::new();
    let events = highlighter
        .highlight(&cfg, src.as_bytes(), None, |_| None)
        .js(&mut cx)?;

    let root = cx.empty_array();
    let mut stack = Vec::<Layer>::new();
    let mut drain = Vec::<Layer>::new();

    let newline = cx.string("\n");

    for event in events {
        let event = event.js(&mut cx)?;
        match event {
            HighlightEvent::Source { start, end } => {
                let source = &src[start..end];

                for mut line in source.split_inclusive('\n') {
                    if line.ends_with('\n') {
                        line = line.trim_end_matches(['\r', '\n']);
                        {
                            let current = match stack.last_mut() {
                                Some(l) => l.children,
                                None => root,
                            };

                            let line = cx.string(line);
                            current.push(&mut cx, line)?;
                        }

                        while let Some(mut layer) = stack.pop() {
                            let obj = layer.as_object(&mut cx)?;
                            let parent = match stack.last_mut() {
                                Some(l) => l.children,
                                None => root,
                            };
                            parent.push(&mut cx, obj)?;

                            layer.children = cx.empty_array();
                            drain.push(layer);
                        }
                        stack.extend(drain.drain(..).rev());

                        root.push(&mut cx, newline)?;
                    } else {
                        let current = match stack.last_mut() {
                            Some(l) => l.children,
                            None => root,
                        };

                        let line = cx.string(line);
                        current.push(&mut cx, line)?;
                    }
                }
            }

            HighlightEvent::HighlightStart(idx) => {
                let name = cfg.names()[idx.0].as_str();
                let children = cx.empty_array();
                stack.push(Layer { name, children });
            }

            HighlightEvent::HighlightEnd => {
                let layer = stack.pop().unwrap().as_object(&mut cx)?;
                let parent = match stack.last_mut() {
                    Some(l) => l.children,
                    None => root,
                };
                parent.push(&mut cx, layer)?;
            }
        }
    }

    Ok(root)
}

struct Layer<'a> {
    name: &'a str,
    children: Handle<'a, JsArray>,
}
impl Layer<'_> {
    fn as_object<'a, C: Context<'a>>(&self, cx: &mut C) -> JsResult<'a, JsObject> {
        let name = cx.string(self.name);
        let children = self.children;

        let obj = cx.empty_object();
        obj.set(cx, "name", name)?;
        obj.set(cx, "children", children)?;

        Ok(obj)
    }
}

trait ResultExt<T, E> {
    fn js<'a, C: Context<'a>>(self, cx: &mut C) -> NeonResult<T>;
}
impl<T, E: Display> ResultExt<T, E> for Result<T, E> {
    fn js<'a, C: Context<'a>>(self, cx: &mut C) -> NeonResult<T> {
        match self {
            Ok(v) => Ok(v),
            Err(e) => cx.throw_error(e.to_string()),
        }
    }
}

trait ArrayExt {
    fn push<'a, C: Context<'a>, V: Value>(&self, cx: &mut C, v: Handle<'a, V>) -> NeonResult<bool>;
}
impl ArrayExt for JsArray {
    fn push<'a, C: Context<'a>, V: Value>(&self, cx: &mut C, v: Handle<'a, V>) -> NeonResult<bool> {
        let idx = self.len(cx);
        self.set(cx, idx, v)
    }
}
