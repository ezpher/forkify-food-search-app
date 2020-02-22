// in-built node package to specify a absolute path for path below 
const path = require('path'); 
// import the html-webpack-plugin, for 5) plugins below
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 1) entry point: where webpack will start looking in for dependencies to bundle
    entry: './src/js/index.js',
    // 2) output point: specify where webpack will save the bundle
    output: {
        // need to specify absolute path using path package from node
        // specify the path where the bundled file is saved e.g. bundle.js 
        // specify the file name of the bundle
        path: path.resolve(__dirname, 'dist'), // updated for webpack-dev-server **formerly 'dist/js' for just running webpack directly
        filename: 'js/bundle.js' // **formerly /bundle.js for just running webpack directly
    },    
    // 3) mode => available from webpack 4 onwards
    // prod vs dev => dev builds w/o minification and tree shaking for fast building

    /* mode: 'development' */
    // note: more convenient to add npm scripts for the different modes, one for prod, the other for development


    // 4) devServer (optional)
    // specify the place from which you would like the dev server to serve your files i.e. dist folder 

    // run the npm script associated with devServer (contains the flag --open to indicate you want to run the server and open the browser)
    // when it opens, it will run it on a local port (closer to actual server environment)

    // **note that devServer will dynamically generate a bundle at the path specified in webpack, instead of saving on disk
    // ** the devServer will try to inject the dynmically-generated bundle into a html at the same location
    // **so make sure that the path reference is set to dist and not dist/js so that it can inject successfully
    // **so that it actually reads the html that is updated into the dist folder and not the old html file
    devServer: {
        contentBase: './dist'
    },

    // 5) loaders/plugins (optional)    
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],

    // loaders
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}

