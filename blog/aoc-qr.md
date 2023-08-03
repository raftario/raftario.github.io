---
title: Fitting an Advent of Code solution in a QR code
published: 2022-12-04
toc: true
---

I recently shared a solution for [day 3](https://adventofcode.com/2022/day/3) of Advent of Code 2022 which was [fully contained in a QR code](https://www.reddit.com/r/adventofcode/comments/zc2om2/2022_day_3_but_its_in_a_qr_code_linux_x64_reads/). As in decoding the code and piping the output into a binary file and then running this file with the problem input prints the answer. This post is about the process to get there.

## The problem

The problem can be summarise pretty simply. You're given an input which contains a bunch of newline separated bags of characters. Each bag contains letters and each letter has a priority. Lowercase letters have a priority ranging from `1` for `a` and `26` for `z` and uppercase ones from `27` for `A` to `52` for `Z`.

Given that input, you need to create groups of 3 bags and for each group find the single letter than appears in all 3 bags, then sum the priority of that letter for all groups to get the answer.

## Naïve approach

The simplest way to go about this is to slit the input in lines, then split the lines in groups, then for each group iterate through all the possible letters to find the one which is in all 3 lines. We can then use a lookup table to find the priority and finally sum everything.

```rs
fn prio(c: char) -> u32 {
    match c {
        'a' => 1,
        // ...
        'z' => 26,
        'A' => 27,
        // ...
        'Z' => 52,
        _ => panic!("invalid input"),
    }
}

// read the input to a string somehow, we'll get back to this later
let input: String = read();
let answer: u32 = input.lines() // split at newlines
    .array_chunks::<3>() // group by 3
    .map(|group| {
        ('a'..='z').chain('A'..='Z') // iterate over every letter
            .find(|c| group.iter().all(|line| line.contains(*c))) // find the one in all 3 groups
            .unwrap()
    })
    .map(prio) // map each letter to its priority
    .sum();
```

## Less naïve approach

There are two low hanging fruits here. The first one is that for each line we iterate trough every possible letter and then for each of those we iterate through each letter in the line. That's a lot of iterating. The second one is that the priority function is way longer than it deserves to be with 1-1 mapping for each letter.

To solve the first we can start by converting each line into the set of letters it contains. This then makes it possible to more efficiently find the letter shared by each group by computing the intersection set of each group of sets.

The second can be solved by using the ASCII value of each letter. All of the letters in use are encoded using a single byte, and their encoded values are in the same order as the alphabet. This is apparent when looking at an [ASCII table](/tools/ascii). This means we can go from ASCII value to priority very easily by substracting the value of `a` for lowercase letter and `A` for uppercase, and then adding either `1` or `27` to the result.

```rs
fn prio(c: u8) -> u32 {
    match c {
        b'a'..=b'z' => c - b'a' + 1,
        b'A'..=b'Z' => c - b'A' + 27,
        _ => panic!("invalid input"),
    }
}

let input: String = read();
let answer: u32 = input.lines()
    .map(|line| line.bytes().collect::<BTreeSet<u8>>()) // collect into a set
    .array_chunks::<3>()
    .map(|[a, b, c]| (a & b & c).pop_first().unwrap()) // find the letter at the intersection of all 3 sets
    .map(prio)
    .sum();
```

This is better, but what if it was still possible to do much better ? What if, say, we could compute the intersection with a single CPU instruction ?

## Enter bitsets

We have 52 different possible letters. Each letter is either present or not. It's a binary choice. A bit. We have 52 bits. Do you know what can fit 52 bits ? Many things, really, but in this case the answer we are looking for here is 64 bits. Now if you do not have a 64 bit processor this is kind of a bummer for you, but thankfully you can order a Pentium on eBay for 10$ and continue reading once it arrives.

A bitset is like an array of booleans except that instead of taking one byte of memory each value takes one bit. It makes adding and removing values a bit cumbersome but operations on the whole set much faster, especially if it can fit in a single CPU register. Which is where the 64 bits part comes in as you might guess.

So how should we encode our letters ? Well we already have the concept of priority, which ranges from `1` to `52`. So why don't we just use the `prio`th bit (this very thoughtful decision will be relevant in helping us later). This value can easily be computer by shifting the bit `1` by `prio` to the left.

```rs
fn bit(prio: u32) -> u64 {
    1 << prio
}
```

Now we need to combine the priority of each letter in a line into a single bitset. This is also very easy to do with a bitwise `or` operation. For those unfamiliar this will combine two bitsets by setting the output bit to `1` if either of the input bits are `1`.

```rs
fn bitset(line: &str) -> u64 {
    // fold is the equivalent of reduce from some other languages
    // https://doc.rust-lang.org/stable/std/iter/trait.Iterator.html#method.fold
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
    line.bytes().map(prio).fold(0, |bitset, prio| bitset | prio)
}
```

If a line contained the letters `a`, `b` and `e`, they would have priorities of `1`, `2` and `5`, mapped to bits `0b000010`, `0b000100` and `0b100000`. By keeping `1`s that are present in any of the 3, we get the bitset `0b100110`.

From there we need to find the intersection of multiple bitsets. This is, again, very easy to do. Just use a bitwise `and` to keep only `1`s that are in all bitsets. If we had a second line with letters `a`, `c` and `d`, its bitset would be `0b011010`. By only keeping `1`s that are in both sets we get `0b000010`. Finally, we can extract the priority from the result by simply counting the number of trailing zeroes, in this case 1, which happens to be the priority of `a`, which happens to be the letter that is in both lines. This is also [a single instruction](https://www.felixcloutier.com/x86/bsf).

```rs
let input: String = read();
let result: u32 = input.lines()
    .map(bitset) // map each line to its bitset
    .array_chunks::<3>()
    .map(|[a, b, c]| (a & b & c).trailing_zeros()) // find the intersection's priority
    .sum();
```

## the end ?

We now have a very efficient solution. However, it still probably wouldn't fit in a QR code. But we now know that most of our manipulations happen on simple numbers and can be encoded in very few instructions. Another interesting property of this solution is that we only ever look at each letter in the input once. Which means we don't really need to ever allocate memory, as we could read the input one byte at a time instead of reading it all into a string.

```rs
let input = std::io::stdin().bytes();

let mut answer = 0; // final answer
let mut lines = 0; // line count for current group

// bitset for the current 3 line group
// set to all ones because of the identity property of bitwise and
// (all ones bitwise and any number returns that number)
let mut group: u64 = !0;
// bitset for the current line
// set to all zeroes because of the identity property of bitwise or
let mut line: u64 = 0;

for byte in input {
    let byte = byte.unwrap(); // if the read errors panic (for now)

    match byte {
        b'\r' => continue, // we can safely ignore carriage returns
        b'\n' => {
            lines += 1;
            // set the group bitset to the intersection of the current line and itself
            group &= line;
            // reset bitset for the next line
            line = 0;

            if lines == 3 {
                lines = 0;
                // add the priority of the group intersection to the answer
                answer += group.trailing_zeros();
                // reset bitset for the next group
                group = !0;
            }
        }

        // add the letter's priority bit to the current line bitset
        b'a'..=b'z' => line |= 1 << (c - b'a' + 1),
        b'A'..=b'Z' => line |= 1 << (c - b'A' + 27),

        _ => panic!("invalid input"),
    }
}

println!("{answer}");
```

And there it is. Our solution now doesn't even need to allocate. The input data could be a terabyte and it would happily chug along. The end. (No)

## I Need No God (libc)

## What the fuck is a syscall
