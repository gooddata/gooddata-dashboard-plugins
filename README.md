## How to push your plugins here

1. Make sure to make your own branch and use PR for merging. Master is write-protected. By the end of the workshop we should ideally see a pull request for every plugin.
2. Use TypeScript over JavaScript when creating a new project, if possible.
3. Create a new folder in the root of the project for your plugin. Make sure the folder naming makes sense.
4. Make sure your IDE sees `.editorconfig` file, or set up the rules manually according to the file. We want our examples to follow similar code style.

----------------

# GoodData Dashboard Plugin examples gallery

You can find a number of Dashboard Plugin examples in this repository. Each folder contains a separate plugin.

TODO - consider preparing a deployment for all these plugins for customers to be able to test it out on their workspaces easier.

# FAQ

## Can I use the plugin for my dashboard in production?

This gallery is primarily meant to be used as a starting point for you to develop your own plugins or to see what
plugins are capable of in general. You should be able to use these plugins in production, but before doing so,
make sure to read the plugin's README.md file. You might want to run it by your security team to ensure the
plugin you've chosen adhere to your company's security requirements.

## I have a nice plugin for this gallery. Can I share it here?

Sure, any contributions are welcome. Just fork the repo and make a pull request.
