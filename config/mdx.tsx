/* eslint-disable react/display-name */

import { MDXProviderComponents } from "@mdx-js/react";

export const components: MDXProviderComponents = {
  h1: (props) => (
    <h1 className="font-display font-medium text-6xl text-base01" {...props} />
  ),
  h2: (props) => (
    <h1 className="font-display font-medium text-5xl text-base01" {...props} />
  ),
  h3: (props) => (
    <h1 className="font-display font-medium text-4xl text-base01" {...props} />
  ),
  h4: (props) => (
    <h1 className="font-display font-medium text-3xl text-base01" {...props} />
  ),
  h5: (props) => (
    <h1 className="font-display font-medium text-2xl text-base01" {...props} />
  ),
  h6: (props) => (
    <h1 className="font-display font-medium text-xl text-base01" {...props} />
  ),
  p: (props) => <p className="font-body" {...props} />,
};
