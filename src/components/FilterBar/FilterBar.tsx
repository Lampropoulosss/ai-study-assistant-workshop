import styles from './FilterBar.module.css';
import { DocsFilterIcon, PdfFilterIcon, ImageFileFilterIcon, AudioFileFilterIcon, VideoFileFilterIcon } from "../icons";

export type FilterBarProps = {
    selectedFilters: { name: string, extensions: string[] }[];
    setSelectedFilters(option: { name: string, extensions: string[] }[]): void;
}

export const FilterBar = ({ selectedFilters, setSelectedFilters }: FilterBarProps) => {

    const onFilterChange = (option: {name: string, extensions: string[]}) => {
        if (selectedFilters.some(item => item.name === option.name)) {
            setSelectedFilters(selectedFilters.filter((item) => item.name !== option.name));
        } else {
            setSelectedFilters([...selectedFilters, option]);
        }
    }

    return (
        <div className={styles.container}>
        <label className={`${styles.filterLabel} ${selectedFilters.some(item => item.name === "docs") ? styles.checked : ''}`}>
            <DocsFilterIcon />
            <input
                type="checkbox"
                checked={selectedFilters.some(item => item.name === "docs")}
                onChange={() => onFilterChange({ name: "docs", extensions: ['doc', 'docx', 'docm', 'txt'] })}
            />
            Docs
        </label>
    
        <label className={`${styles.filterLabel} ${selectedFilters.some(item => item.name === "pdf") ? styles.checked : ''}`}>
            <PdfFilterIcon />
            <input
                type="checkbox"
                checked={selectedFilters.some(item => item.name === "pdf")}
                onChange={() => onFilterChange({ name: "pdf", extensions: ['pdf'] })}
            />
            PDF
        </label>
    
        <label className={`${styles.filterLabel} ${selectedFilters.some(item => item.name === "images") ? styles.checked : ''}`}>
            <ImageFileFilterIcon />
            <input
                type="checkbox"
                checked={selectedFilters.some(item => item.name === "images")}
                onChange={() => onFilterChange({ name: "images", extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg'] })}
            />
            Images
        </label>
    
        <label className={`${styles.filterLabel} ${selectedFilters.some(item => item.name === "mp3/audio") ? styles.checked : ''}`}>
            <AudioFileFilterIcon />
            <input
                type="checkbox"
                checked={selectedFilters.some(item => item.name === "mp3/audio")}
                onChange={() => onFilterChange({ name: "mp3/audio", extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg'] })}
            />
            MP3/Audio
        </label>
    
        <label className={`${styles.filterLabel} ${selectedFilters.some(item => item.name === "mp4/audio") ? styles.checked : ''}`}>
            <VideoFileFilterIcon />
            <input
                type="checkbox"
                checked={selectedFilters.some(item => item.name === "mp4/audio")}
                onChange={() => onFilterChange({ name: "mp4/audio", extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'] })}
            />
            MP4/Video
        </label>
    </div>
    
    );
};
