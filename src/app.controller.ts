import {Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {AppService} from './app.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {Response} from 'express';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('files')
    getFiles(): string {
        return this.appService.getFileNames()
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get("all")
    ParseAll(): Promise<Array<{ Title: string; Album: string; Duration: number; Artist: string }>> {
        return this.appService.ParseAll(2)
    }

    @Get('xml')
    async getSongsAsXML() {
        return await this.appService.ParseAllXML(1);
        // return "Hello XML ";
        // return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n" +
        //     "<rss version=\"2.0\" xmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\" xmlns:content=\"http://purl.org/rss/1.0/modules/content/\">\n" +
        //     "    <channel>\n" +
        //     "        <title>Nikhil's Music</title>\n" +
        //     "        <link>https://www.apple.com/itunes/podcasts/</link>\n" +
        //     "        <language>en</language>\n" +
        //     "        <copyright>&amp;#169; 2020 John Appleseed</copyright>\n" +
        //     "        <itunes:author>The orange</itunes:author>\n" +
        //     "        <description>This has random music compiled from garageband! Flubba bubba</description>\n" +
        //     "        <itunes:type>serial</itunes:type>\n" +
        //     "        <itunes:image href=\"https://applehosted.podcasts.apple.com/hiking_treks/artwork.png\"/>\n" +
        //     "        <itunes:category text=\"history\"/>\n" +
        //     "        <itunes:explicit>false</itunes:explicit>\n" +
        //     "        <item>\n" +
        //     "            <itunes:episodeType>full</itunes:episodeType>\n" +
        //     "            <itunes:title>Fortunate Son</itunes:title>\n" +
        //     "            <title>Fortunate Son Title</title>\n" +
        //     "            <description>\n" +
        //     "                <![CDATA[Album: Chronicle, Vol. 1: The 20 Greatest Hits UK, Duration: 142.88979591836735, Artist: Creedence Clearwater Revival]]></description>\n" +
        //     "            <enclosure length=\"5842851\" type=\"audio/mpeg\" url=\"http://localhost:3000/file/Fortunate_Son.mp3\"/>\n" +
        //     "            <guid>D03EEC9B-B1B4-475B-92C8-54F853FA2A22</guid>\n" +
        //     "            <pubDate>Tue, 8 Jan 2019 01:15:00 GMT</pubDate>\n" +
        //     "            <itunes:duration>142</itunes:duration>\n" +
        //     "            <itunes:explicit>false</itunes:explicit>\n" +
        //     "        </item>\n" +
        //     "    </channel>\n" +
        //     "</rss>"

        // return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        //     "<rss version=\"2.0\" xmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\" xmlns:content=\"http://purl.org/rss/1.0/modules/content/\">\n" +
        //     "  <channel>\n" +
        //     "    <title>Hiking Treks</title>\n" +
        //     "    <link>https://www.apple.com/itunes/podcasts/</link>\n" +
        //     "    <language>en-us</language>\n" +
        //     "    <copyright>&#169; 2020 John Appleseed</copyright>\n" +
        //     "    <itunes:author>The Sunset Explorers</itunes:author>\n" +
        //     "    <description>\n" +
        //     "      Love to get outdoors and discover nature&apos;s treasures? Hiking Treks is the\n" +
        //     "      show for you. We review hikes and excursions, review outdoor gear and interview\n" +
        //     "      a variety of naturalists and adventurers. Look for new episodes each week.\n" +
        //     "    </description>\n" +
        //     "    <itunes:type>serial</itunes:type>\n" +
        //     "    <itunes:image\n" +
        //     "      href=\"https://applehosted.podcasts.apple.com/hiking_treks/artwork.png\"\n" +
        //     "    />\n" +
        //     "    <itunes:category text=\"Sports\">\n" +
        //     "      <itunes:category text=\"Wilderness\"/>\n" +
        //     "    </itunes:category>\n" +
        //     "    <itunes:explicit>false</itunes:explicit>\n" +
        //     "    <item>\n" +
        //     "      <itunes:episodeType>trailer</itunes:episodeType>\n" +
        //     "      <itunes:title>Hiking Treks Trailer</itunes:title>\n" +
        //     "      <title>S02 EP04 Mt. Hood, Oregon</title>\n" +
        //     "      <description>\n" +
        //     "          <![CDATA[The Sunset Explorers share tips, techniques and recommendations for\n" +
        //     "          great hikes and adventures around the United States. Listen on \n" +
        //     "          <a href=\"https://www.apple.com/itunes/podcasts/\">Apple Podcasts</a>.]]>\n" +
        //     "      </description>\n" +
        //     "      <enclosure \n" +
        //     "        length=\"498537\" \n" +
        //     "        type=\"audio/mpeg\" \n" +
        //     "        url=\"http://example.com/podcasts/everything/AllAboutEverythingEpisode4.mp3\"\n" +
        //     "      />\n" +
        //     "      <guid>D03EEC9B-B1B4-475B-92C8-54F853FA2A22</guid>\n" +
        //     "      <pubDate>Tue, 8 Jan 2019 01:15:00 GMT</pubDate>\n" +
        //     "      <itunes:duration>1079</itunes:duration>\n" +
        //     "      <itunes:explicit>false</itunes:explicit>\n" +
        //     "    </item>\n" +
        //     "  </channel>\n" +
        //     "</rss>"
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: 'Express.Multer.File') {
        console.log(file);
    }

    @Get(":song")
    ParseFiles(@Param("song") song: number): Promise<{
        Title?: string;
        Album?: string;
        Duration?: number;
        Artist?: string
    }> {
        return this.appService.ParseOne(+song);
    }

    @Post()
    create(@Body() nsong: { path: string }) {
        return this.appService.create(nsong)
    }

    @Get("file/:filename")
    getFile(@Param("filename") filename: string, @Res() res) {
        return this.appService.getstaticfilename(filename, res)
    }


}
