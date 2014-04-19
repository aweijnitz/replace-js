# Replace.js
Traverse a file tree and search/replace text in files mathing a search expression. Node.js command line utility.

## Install
- Download/git clone this repo
- Go to the folder
- ```npm install```
- Make sure it works ```npm test```
- Put the folder in your path
- (Write a convenience shell-script arund it)

## Use
### General

	node replace.js [-v -e <charEncoding> ] -i <fileMatchPattern> startDir searchPattern replaceString


#### Parameters
__-v__ Is optional. Enables verbose output.

__-e charEncoding__ Is optional and defaults to __utf8__.

__-i fileMatchPattern__ is *required*. Any file mathing the pattern will be searched and replaced into. Matching is done on the file name only (omitting path info).

__startDir__ can be abslute or relative from the current working dir. replace.js will search the directory and recurse down all sub-directories.

__searchPattern__ can be any valid javascript regexp. Internally, it is wrapped in a RegExp like this ```new RegExp(searchPattern, 'g')```.


### Example

*Comment out all console.log()*

	node replace.js -v -i *js /home/user/projects/MyApp/src console "// console"

*Note:* Not really a safe thing to do, unless you know all of them are on a separate line!






