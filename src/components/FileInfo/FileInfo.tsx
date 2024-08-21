import { FileData } from "@/types/data.types"
import { useEffect, useState } from "react"
import { unbody } from "@/services/api";

import MuxVideo from "@mux/mux-video-react";
import MuxAudio from "@mux/mux-audio-react";

import styles from './FileInfo.module.css'

type FileInfoProps = {
    item: FileData
}

export const FileInfo = ({ item }: FileInfoProps) => {
    const [fileUrl, setFileUrl] = useState<string | undefined>("")

    useEffect(() => {
        (async () => {
            if (item.type === 'image') {
                const { data: { payload: ImageBlock } } = await unbody.get.imageBlock.where({ id: item.id }).exec();
                setFileUrl(ImageBlock ? ImageBlock[0].url as string : "");
            } else if (item.type === 'video') {
                const { data: { payload: videoFiles  } } = await unbody.get.videoFile.where({ id: item.id }).exec();
                setFileUrl(videoFiles ? videoFiles[0].playbackId as string : "");
            } else if (item.type === 'audio') {
                const { data: { payload: audioFiles  } } = await unbody.get.audioFile.where({ id: item.id }).exec();
                setFileUrl(audioFiles ? audioFiles[0].playbackId as string : "");
            }
        })(); 

    }, []);


    return (
        <div className={styles.container}>
                {item.type === 'image' && <img src={fileUrl} alt={item.name} className="" />}
                {item.type === 'video' && <MuxVideo controls playbackId={fileUrl} streamType="on-demand" />}
                {item.type === 'audio' && <MuxAudio controls playbackId={fileUrl} streamType="on-demand" />}
                <div>
                    <h3 className="text-gray-500">{item.name}</h3>
                    <p className="text-xs text-gray-400">Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... Auto Summary... </p>
                </div>
            </div>
    )
}