'use client'

import { IoMdDownload } from "react-icons/io";

interface IAudioPlayerProps {
    src: string
  }

const AudioPlayer = ({ src }: IAudioPlayerProps) => (
    <div className="flex gap-2 items-center">
      <audio controls>
        <source src={src} type="audio/wav" />
        Your browser does not support the audio tag.
      </audio>
      <a href={src} download>
       <IoMdDownload size={20} />
      </a>
    </div>
  );

export default AudioPlayer