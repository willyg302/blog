import os
import re

from datetime import datetime


project = 'WillyG Productions Blog'

def new_post():
	'''Create new blog post'''
	metadata = '---\ntitle: "{}"\ndate: {}\ntags: "{}"\ntemplate: post.jade\ncomments: true\n---\n'
	time_str = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%f')
	title = raw_input('Title: ')
	filename = '{}-{}'.format(time_str.split('T')[0], re.sub('[-\s]+', '-', re.sub('[^\w\s-]', '', title).strip().lower()))
	with open(os.path.join('app', 'posts', '{}.md'.format(filename)), 'w') as f:
		f.write(metadata.format(title, time_str, raw_input('Tags: ') or 'Uncategorized'))

def publish():
	'''Publish blog'''
	ok.node('gulp deploy', module=True)

def install():
	ok.npm('install').bower('install')

def default():
	'''Build blog'''
	ok.node('gulp', module=True).node('gulp clean', module=True)
