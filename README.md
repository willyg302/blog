# WillyG Blog

See it [here](http://willyg302.github.io/blog).

## Development

This blog requires [ok](https://github.com/willyg302/ok) to build.

Run `ok run new_post` to create a new blog post. You will be prompted for the post title and a comma-separated list of categories.

Run `ok` to build the blog, then `ok run publish` to publish the changes to GitHub Pages. For local development, use `http-server .` and navigate to the `blog/` subdirectory (this is done to keep absolute links correct locally, since the published blog is a subdomain of the [main site](http://willyg302.github.io/)).
