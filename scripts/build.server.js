// 만든 환경 설정을 사용하여 웹팩으로 프로젝트를 빌드하는 스크립트 
process.env.BABEL_ENV='production';
process.env.NODE_ENV='production';

process.on('unhandleRejection',err=>{
    throw err;
});

require('../config/env');
const fs =require('fs-extra');
const webpack=require('webpack');
const config = require('../config/webpack.config.server');
const paths=require('../config/paths');

function build(){
    console.log('Creating Server Build..');
    fs.emptyDirSync(paths.ssrBuild);
    let compiler = webpack(config);
    return new Promise((resolve,reject)=>{
        compiler.run((err,stats)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log(stats.toString());
        });
    });
}

build();