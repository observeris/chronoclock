
#!/bin/bash

commandCheck () {
   # if [ -z "$1" ]                           # Is parameter #1 zero length?
   # then
   #   echo "-Parameter #1 is zero length.-"  # Or no parameter passed.
   # else
   #   echo "-Parameter #1 is \"$1\".-"
   # fi
   #
   # if [ -z "$2" ]                           # Is parameter #1 zero length?
   # then
   #   echo "-Parameter #2 is zero length.-"  # Or no parameter passed.
   # else
   #   echo "-Parameter #2 is \"$2\".-"
   # fi

   command -v $1 >/dev/null 2>&1;

   local command_ok=$?;
   # echo $command_ok;
   if [ "$command_ok" -ne "0" ]
   then
       echo >&2 "$2";
   fi

   return $command_ok
   }


commandCheck "node" "I require NODE.JS but it's not installed.\n - Please head to https://nodejs.org/ and install the latest LTS (Long-Term Support) version.";
node_ok=$?;

commandCheck "npm" "I require NPM but it's not installed.\n - Please head to https://nodejs.org/ and install/reinstall the latest LTS (Long-Term Support) version.";
npm_ok=$?;

commandCheck "gulp" "I require GULP but it's not installed.\n - Please type 'sudo npm install gulp --global' and try again.\n - (On WINDOWS, type 'npm install gulp --global' in any terminal ran by Administrator, and try again )";
gulp_ok=$?;

commandCheck "browserify" "I require BROWSERIFY but it's not installed.\n - Please type 'sudo npm install browserify --global' and try again.\n - (On WINDOWS, type 'npm install browserify --global' in any terminal ran by Administrator, and try again )";
browserify_ok=$?;

commandCheck "babel" "I require BABEL but it's not installed.\n - Please type 'sudo npm install babel-cli --global' and try again.\n - (On WINDOWS, type 'npm install babel-cli --global' in any terminal ran by Administrator, and try again )";



if  [ "$node_ok" = "0" ] && [ "$npm_ok" = "0" ] && [ "$gulp_ok" = "0" ]
then
nodeversion=$(node --version);
    echo "Node.JS version: \"$nodeversion\"";
npmversion=$(npm --version);
    echo "NPM version: \"$npmversion\"";
gulpversion=$(gulp --version);
    echo "GULP version: \"$gulpversion\"";
browserify_version=$(browserify --version);
    echo "BROWSERIFY version: \"$browserify_version\"";
babel_version=$(babel --version);
    echo "BABEL version: \"$babel_version\"";
fi
