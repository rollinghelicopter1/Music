import {Controller, Get, Body, Param, Post, UploadedFile, UseInterceptors, HttpStatus, Res} from '@nestjs/common';
import {AppService} from './app.service';
import {FileInterceptor} from "@nestjs/platform-express";
import { Response } from 'express';

import * as fs from "fs";
import * as path from "path";

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

    @Get('allXML')
    async getSongsAsXML(@Res() res: Response): Promise<void> {
        try {
            // Call the service method to get the XML string
            const xmlString = await this.appService.ParseAllXML(1);

            // Set the Content-Type header to application/xml and send the response
            res.type('xml version="1.0" encoding="UTF-8"')
            res.send(xmlString)

        } catch (error) {
        }
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
