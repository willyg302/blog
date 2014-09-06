import os
import re
import json

from time import strftime


project = 'WillyG Productions Blog'

def _npm_bower(command):
	strap.run('npm {}'.format(command))
	with strap.root('app'):
		strap.run('bower {}'.format(command))

def clean():
	_npm_bower('prune')
	_npm_bower('cache clean')

def new_post():
	'''Create new blog post'''
	time_str = strftime('%Y-%m-%d %H:%M:%S %z')
	title = raw_input('Title: ')
	filename = '{}-{}'.format(time_str.split()[0], re.sub('[-\s]+', '-', re.sub('[^\w\s-]', '', title).strip().lower()))
	with open(os.path.join('app', 'posts', '{}.md'.format(filename)), 'w') as f:
		f.write('<!--\nlayout: post\ntitle: {}\ndate: {}\ncomments: true\ncategories: {}\n-->\n'.format(title, time_str, raw_input('Categories: ')))

def _parse_post_header(header):
	ret = {}
	for line in header.replace('<!--\n', '').strip().split('\n'):
		k, v = [e.strip() for e in line.split(':', 1)]
		if k in ['layout', 'title', 'date', 'comments', 'categories']:
			if k == 'categories':
				ret[k] = [e.strip() for e in v.split(',')]
			else:
				ret[k] = v
	return ret

def generate_post_json():
	'''Generate post JSON'''
	post_info = []
	post_categories = []
	for filename in os.listdir(os.path.join('dist', 'posts')):
		if not filename.endswith('.html'):
			continue
		with open(os.path.join('dist', 'posts', filename), 'r') as f:
			header, more = f.read().split('<!-- more -->')[0].split('-->')
			info = _parse_post_header(header)
			for e in info['categories']:
				if e and e not in post_categories:
					post_categories.append(e)
			post_info.append(dict(info, **{
				'more': more.strip(),
				'url': filename.replace('.html', '')
			}))
	with open(os.path.join('dist', 'post_data.json'), 'w') as f:
		json.dump(post_info, f)
	with open(os.path.join('dist', 'post_categories.json'), 'w') as f:
		json.dump(post_categories, f)

def rebuild_posts():
	'''Rebuild only posts and post data'''
	strap.run(['node_modules/.bin/gulp convert', generate_post_json])

def publish():
	'''Publish blog'''
	strap.run('git subtree push --prefix dist origin gh-pages')

def install():
	_npm_bower('install')

def default():
	strap.run(['node_modules/.bin/gulp', generate_post_json])
