import {Controller, Get, Injectable, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {AppService} from './app.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {IAudioMetadata, parseFile} from 'music-metadata';

import * as fs from "fs";
import * as path from "path";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('files')
    getFiles(): string[] {
        return this.appService.getFileNames()
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: 'Express.Multer.File') {
        console.log(file);
    }

    @Get("Parse")
    ParseFiles(): Promise<IAudioMetadata> {
        return this.appService.ParseFiles();
    }


}
