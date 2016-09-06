### Idea
I took the example done in Cory House's course https://github.com/coryhouse/pluralsight-redux-starter/ and added some extra features such as server side rendering.

### Key features
- Server side rendering (Dev and Prod)
- More real life example (compared to other starter kits) as it includes a fake API and all the data flow already working
- Redux
- Linting
- Unit Test (Mocha, Chai, Enzyme)
- It works with JS disabled

### Project Structure
##### config
Webpack configuration files.
##### tools
Build and Test set up files
##### client
Client side entry point (when running on Dev mode)
##### server
Server side entry point (when running on Prod mode)
##### dist
All the compiled files will go here when running build task
##### src
Main folder which includes all the logic and markup existing in the project. Some of the key elements here are:


* Redux stuff: **actions**, **store**, and **reducers** folders.
* **styles** (General styles) Any style file which isn't specific for a component
* **api** Api (faked) data and methods
* **components** is divided by module in different folders (all of them specific for the component folder). Each module can have the following type of files (followed by the naming convention):

    * **Style files**: [COMPONENT NAME].scss
    * **Component containers**: [COMPONENT NAME].container.js
    * **Stateless components**: [COMPONENT NAME].js
    * **Test files**: [COMPONENT NAME].test.js

### First steps
- Clone the repository
- Run the following from the command line: `npm install`

#### Run Dev
- `npm start`

#### Run Prod
- `npm build:prod`
- `npm start:prod`
