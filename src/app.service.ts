import {Injectable, Module, Res} from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";
import {IAudioMetadata, IPicture, parseFile,} from "music-metadata";
import * as xml2js from 'xml2js';
import {ServeStaticModule} from "@nestjs/serve-static";
import {Response} from "express";

@Injectable()
@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: path.join("/Users/meerasrinivasan/WebstormProjects/music/music/dist/uploads"),
        }),
    ],
})

export class AppService {
    private  songs=[
        {
        "song":1,
            "path":"/Users/meir/stock/projects/Nikhil/Music2/src/uploads/Fortunate_Son.mp3"
    },/*
        {
            "song":2,
            "path":"/Users/meerasrinivasan/WebstormProjects/music/music/uploads/My_bass.m4a"
        },
        {
           "song":3,
           "path":"/Users/meerasrinivasan/WebstormProjects/music/music/uploads/My_piano.m4a"
        },*/
    ]
    getHello(): string {
        return 'Hello World!';
    }

    directoryPath = path.join("/Users/meerasrinivasan/WebstormProjects/music/music/dist/uploads")

    getFileNames(): string {
        try {
            const files = fs.readdirSync(this.directoryPath)
            return (path.join(__dirname, 'uploads'))
        } catch (err) {
            console.error("Error reading directory", err)
        }
        throw new Error("Error reading directory");
    }
    async  ParseAll(song:number): Promise<Array<{ Title: string; Album: string; Duration: number; Artist: string }>> {
        try {
            song = 1
            const results :Array<{Title:string,Album:string,Duration:number,Artist:string,url:string}> =[]
            while (song <= this.songs.length) {
                const paths = this.songs.find(path => path.song == song);

                const metadata: IAudioMetadata = await parseFile(path.join(paths.path))
                const {common, format} = metadata;
                results.push ({
                    Title: common.title,
                    Album: common.album,
                    Duration: format.duration,
                    Artist: common.artist,
                    url:paths.path

                })
                song += 1

            }

            return results

        } catch (error) {
            console.log("whoops")
        }
    }
    async  ParseAllXML(song:number): Promise<Array<{ Title: string; Album: string; Duration: number; Artist: string; url:string }>> {
        try {
            song = 1

            const results :Array<{Title:string,Album:string,Duration:number,Artist:string,url:string,size:number}> =[]

            while (song <= this.songs.length) {
                const paths = this.songs.find(path => path.song == song);

                const metadata: IAudioMetadata = await parseFile(path.join(paths.path))
                const {common, format} = metadata;
               const stats= await fs.promises.stat(paths.path)
                song += 1
                results.push ({
                    Title: common.title,
                    Album: common.album,
                    Duration: format.duration,
                    Artist: common.artist,
                    url:paths.path,
                    size:stats.size

                })
            }
          // const filesize =async (path: string) => {
            //   const stats = await fs.promises.stat(path);
             //  return stats.size

          // }
            //const stats = await fs.promises.stat(`${song.url}`);

            const builder = new xml2js.Builder()
            const xmlObject={
                rss:{
                    $:{
                        version:"2.0",
                        "xmlns:itunes":"http://www.itunes.com/dtds/podcast-1.0.dtd",
                        "xmlns:content":"http://purl.org/rss/1.0/modules/content/"

                    },

                channel:{
                        title:"Nikhil's Music",
                        "link":"https://www.apple.com/itunes/podcasts/",
                        "language":"en",
                        copyright:"&#169; 2020 John Appleseed",
                        "itunes:author":"The orange",
                    description:"This has random music compiled from garageband! Flubba bubba",
                    "itunes:type":"serial",


                        "itunes:image":{
                            $:{
                                href:"https://applehosted.podcasts.apple.com/hiking_treks/artwork.png",

                            }
            },


                        "itunes:category":{
                            $:{
                                'text':"history",
                            }
                        },
                        "itunes:explicit":'false',



                        item:results.map(song=>({
                            "itunes:episodeType":"full",
                            "itunes:title": song.Title,
                            title: song.Title,
                            // description: `Album: ${song.Album}, Duration: ${song.Duration}, Artist: ${song.Artist}`,
                            description: `hello description`,
                            enclosure: {
                                $: {
                                    length: song.size,
                                    type: "audio/mpeg",
                                    url: "http://localhost:3000/file/Fortunate_Son.mp3", // Construct the URL for the media file


                                }


                            },
                            "guid":"http://localhost:3000/file/Fortunate_Son.mp3",
                            "pubDate":"Tue, 8 Jan 2019 01:15:00 GMT",
                            "itunes:duration": 142,
                            "itunes:explicit":"false",
                        }))

                }
                }
            }
            const xml = builder.buildObject(xmlObject);
            return xml;

        } catch (error) {
            console.log("whoops")
        }
    }

    async  ParseOne(song:number): Promise<{ Title?:string, Album?:string, Duration?:number, Artist?:string, }> {
       try {
           const paths = this.songs.find(path =>path.song == song);
           console.log(paths);
           const metadata:  IAudioMetadata =   await parseFile(path.join(paths.path))
            const { common, format } = metadata;
            return {
                Title:common.title,
                Album:common.album,
                Duration:format.duration,
                Artist:common.artist,


            }
        }
catch (error) {
           console.log("whoops")
}

    }

    create(nsong: { path: string }){
const highersongnumber=[...this.songs].sort(
    (a,b) => b.song-a.song)
const newSong={
    song:highersongnumber[0].song+1,
        ...nsong


}
this.songs.push(newSong)
        return newSong;
    }
    getstaticfilename( filename:string, res: Response){
            const filepath =path.join(process.cwd(), "uploads",filename);
            console.log(filepath)
        return res.sendFile(filepath)
    }
}
// rename mp3 files(no special charecters/spaces), access files through browser-find where files in nest can be placed so they can be accesee through the browser,