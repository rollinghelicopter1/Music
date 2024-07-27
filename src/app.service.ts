import {Injectable} from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";
import {IAudioMetadata, parseFile} from "music-metadata";

@Injectable()

export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    directoryPath = path.join("/Users/meerasrinivasan/WebstormProjects/music/music/src/uploads")

    getFileNames(): string[] {
        try {
            const files = fs.readdirSync(this.directoryPath)
            return files
        } catch (err) {
            console.error("Error reading directory", err)
        }
        throw new Error("Error reading directory");
    }

    ParseFiles(): Promise<IAudioMetadata> {
        return parseFile('/src/uploads')
    }
}
