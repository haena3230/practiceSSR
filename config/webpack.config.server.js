// 웹팩 기본 설정
const paths=require('./paths');
const getCSSModuleLocalIdent=require('react-dev-utils/getCSSModuleLocalIdent'); // CSS 모듈의 고유 classname 만들때 필요
const nodeExternals= require('webpack-node-externals');
const webpack=require('webpack');
const getClientEnvironment=require('./env');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex=/\.(scss|sass)$/;
const sassModuleRegex=/\.module\.(scss|sass)$/;

const publicUrl = paths.publicUrlOrPath.slice(0,-1);
const env = getClientEnvironment(publicUrl);

module.exports={
    mode:'production', // 프로덕션 모드로 설정하여 최적화 옵션들을 활성화
    entry:paths.ssrIndexJs, // 엔트리 경로
    target:'node',  // node 환경 실행 명시
    output:{
        path:paths.ssrBuild, // 빌드 경로
        filename: 'server.js', // 파일 이름
        chunkFilename:'js/[name].chunk.js', 
        publicPath:paths.publicUrlOrPath, // 정적 파일이 제공될 경로
    },
    module:{
        rules:[
            {
                oneOf:[
                    // 자바스크립트를 위한 처리
                    // 기존 webpack.config.js를 참고
                    {
                        test:/\.(js|mjs|jsx|ts|tsx)$/,
                        include:paths.appSrc,
                        loader:require.resolve('babel-loader'),
                        options:{
                            customize:require.resolve(
                                'babel-preset-react-app/webpack-overrides'
                            ),
                            plugins:[
                                [
                                    require.resolve('babel-plugin-named-asset-import'),
                                    {
                                        loaderMap:{
                                            svg:{
                                                ReactComponent:'@svgr/webpack?-svgo![path]'
                                            }
                                        }
                                    }
                                ]
                            ],
                            cacheDirectory:true,
                            cacheCompression:false,
                            compact:false
                        }
                    },
                    // CSS를 위한 처리
                    {
                        test:cssRegex,
                        exclude:cssModuleRegex,
                        // exportOnlyLocal:true 실제 CSS 파일 생성하지 않는 옵션 
                        loader:require.resolve('css-loader'),
                        options:{
                            onlyLocals:true
                        }
                    },
                    // CSS 모듈을 위한 처리
                    {
                        test: cssModuleRegex,
                        loader:require.resolve('css-loader'),
                        options:{
                            modules:true,
                            onlyLocals:true,
                            getLocalIndent:getCSSModuleLocalIdent
                        }
                    },
                    // Sass를 위한 처리
                    {
                        test:sassRegex,
                        exclude:sassModuleRegex,
                        use:[
                            {
                                loader:require.resolve('css-loader'),
                                options:{
                                    onlyLocals:true
                                }
                            },
                            require.resolve('sass-loader')
                        ]
                    },
                    // Sass + CSS Module을 위한 처리
                    {
                        test:sassRegex,
                        exclude:sassModuleRegex,
                        use:[
                            {
                                loader:require.resolve('css-loader'),
                                options:{
                                    modules:true,
                                    onlyLocals:true,
                                    getLocalIndent:getCSSModuleLocalIdent
                                }
                            },
                            require.resolve('sass-loader')
                        ]
                    },
                    // url-loader를 위한 설정
                    {
                        test:[/\.bmp$/,/\.gif$/,/\.jpe?g$/,/\.png$/],
                        loader:require.resolve('url-loader'),
                        options:{
                            emitFile:false, // 파일을 따로 저장 안하겠음
                            limit:1000, // 원래 9.76KB가 넘어가면 파일로 저장하는데 false일때는 경로만 준비하고 파일 저장 안함
                            name:'static/media/[name].[hash:8].[ext]'
                        }
                    },
                    // 위에서 설정된 확장자를 제외한 파일들은 
                    // file-loader를 사용
                    {
                        loader:require.resolve('file-loader'),
                        exclude:[
                            /\.(js|mjs|jsx|ts|tsx)$/,/\.html$/,/\.json$/
                        ],
                        options:{
                            emitFile:false,
                            name:'static/media/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    // 코드에서 node_modules 내부의 라이브러리를 불러올 수 있게 설정
    resolve:{
        modules:['node_modules']
    },
    externals:[nodeExternals()],
    // 환경변수 주입
    plugins:[
        new webpack.DefinePlugin(env.stringified)
    ]
};