const sharp = require('sharp');
const compress_images = require('compress-images');
const fs = require('fs');

const path = process.argv[3];
const width = Number(process.argv[4]);
const option = process.argv[2];

function resize(inputPath, outputPath, width) {

    sharp(inputPath).resize({width: width}).toFile(outputPath, (err) => {
        if(err) console.log(err);

        compress(outputPath, "./compressed/" );
    })
}

function compress(inputPath, outputPath ) {
    compress_images(inputPath, outputPath, { compress_force: false, statistic: true, autoupdate: true }, false,
                    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
                    { svg: { engine: "svgo", command: "--multipass" } },
                    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
      function (error, completed, statistic) {
        console.log("-------------");
        console.log(error);
        console.log(completed);
        console.log(statistic);
        console.log("-------------");

        fs.unlink(inputPath, (err)=> {
            if(err) {
                console.log(err);
            } else {
                console.log(inputPath, "deleted")
            }
        })

      });


}

function rotateImage(inputPath, outputPath, angle){
    sharp(inputPath).rotate(Number(angle)).toFile(outputPath, (err) => {
        if(err) {
            console.log(err)
        } else {
            console.log("rotate sucsses");
            compress(outputPath, "./compressed/" );
        }
    })
}


if(option == 'resize'){
    resize(path, './temp/output.jpg', width);
}

if(option == 'rotate'){
    rotateImage(path, './temp/output.jpg', width);
}


