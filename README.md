# WillyG Blog

See it [here](http://willyg302.github.io/blog).

## Development

This blog requires [ok](https://github.com/willyg302/ok) to build.

Run `ok run new_post` to create a new blog post. You will be prompted for the post title and a comma-separated list of categories.

Run `ok` to build the blog, then `ok run publish` to publish the changes to GitHub Pages. If you've only changed a post since the last publish, you can run `ok run build_posts` to avoid rebuilding the entire blog.

## Todo

- [ ] Take the post `comments` metadata into account
- [ ] Fully static blog (still with search functionality)
- [ ] RSS feed
