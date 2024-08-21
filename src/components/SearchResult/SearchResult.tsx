import { FileData } from '@/types/data.types'
import { Accordion, AccordionItem, Checkbox, Divider } from '@nextui-org/react'
import clsx from 'clsx'
import React, { useMemo, useState } from 'react'
import { ContextPanel } from '../ContextPanel/ContextPanel'
import { FileCard } from '../FileCard'
import { FolderCard } from '../FolderCard'
import type {Selection} from "@nextui-org/react";
import {
  AudioFileIcon,
  DraftIcon,
  FolderIcon,
  ImageIcon,
  PdfFileIcon,
  VideoFileIcon,
} from '../icons'
import { FileInfo } from '../FileInfo'

const iconMap = {
  folder: FolderIcon,
  pdf: PdfFileIcon,
  document: DraftIcon,
  video: VideoFileIcon,
  audio: AudioFileIcon,
  image: ImageIcon,
}

export type SearchResultProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'selected' | 'onSelect' | 'title'
> & {
  title?: React.ReactNode
  description?: React.ReactNode

  files?: FileData[]
  selected?: string[]
  onSelect?: (selected: string[]) => void

  hideList?: boolean
  compactOverview?: boolean

  filters: { name: string; extensions: string[] }[]
}

export const SearchResult: React.FC<SearchResultProps> = ({
  title,
  description,
  selected = [] as string[],
  onSelect,
  files = [],
  className,
  hideList = false,
  compactOverview = false,
  filters,
  ...props
}) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const filteredFiles = useMemo(() => {
    if (!filters.length) return files;
    return files.filter(file => {
      return filters.some(filter => {
        if (file.type === 'folder' || !file.name.includes(".")) return false;
        return filter.extensions.includes(file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length).toLowerCase())
      }
      );
    });
  }, [files, filters]);

  const map: Record<string, FileData> = useMemo(
    () => Object.fromEntries(filteredFiles.map((file) => [file.id, file])),
    [filteredFiles, selected],
  )

  const [directoriesGroup, filesGroup] = useMemo(
    () => [
      filteredFiles.filter((f) => f.type === 'folder'),
      filteredFiles.filter((f) => f.type !== 'folder'),
    ],
    [filteredFiles, map],
  )

  const onSelectionChange = (newValue: string[]) => {
    if (onSelect) onSelect(newValue)
  }

  const isItemSelected = (id: string) => {
    const { type, children = [] } = map[id]
    const ids = type === 'folder' ? children.map((child) => child.id) : [id]

    return ids.every((id) => selected.includes(id))
  }

  const onCheckboxChange = (id: string) => {
    const item = map[id]
    const isSelected = isItemSelected(id)

    if (item.type === 'folder') {
      const children = item.children || []

      const newSelected = isSelected
        ? selected.filter(
            (item) => !children.map((child) => child.id).includes(item),
          )
        : Array.from(
            new Set([...selected, ...children.map((child) => child.id)]),
          )

      onSelectionChange(newSelected)
    } else {
      const newSelected = selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id]

      onSelectionChange(newSelected)
    }
  }

  return (
    <div className={clsx('relative', className)} {...props}>
      <div>
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
        <div className="py-2 pb-8">
          <ContextPanel
            map={map}
            selected={selected}
            compact={compactOverview}
            className={clsx(
              'duration-300',
              'absolute right-0 w-full transition',
              !compactOverview && 'translate-y-0',
              compactOverview && 'translate-y-[-50px]',
            )}
          />
        </div>
      </div>
      <div className="mt-8">
        <Accordion
          isCompact
          hideIndicator
          keepContentMounted
          selectedKeys={!hideList ? ['root-tree'] : []}
        >
          <AccordionItem
            title={null}
            key="root-tree"
            HeadingComponent={() => <></>}
          >
            <div className={clsx('max-h-[500px] overflow-y-auto')}>
              {directoriesGroup.map((item, index) => (
                <div key={index}>
                  <div className={clsx('flex flex-row items-center')}>
                    <FolderCard
                      name={item.name}
                      label={[
                        'Folder',
                        `${(item.children || []).length} items`,
                      ]}
                      selectedKeys={[]}
                      itemProps={{
                        onPress: () => onCheckboxChange(item.id),
                        startContent: (
                          <>
                            <Checkbox
                              className="pe-[16px]"
                              isSelected={isItemSelected(item.id)}
                              onValueChange={() => onCheckboxChange(item.id)}
                            />
                          </>
                        ),
                        hideIndicator: true,
                      }}
                    />
                  </div>
                </div>
              ))}

              <Divider className="my-2" />

              {filesGroup.map((item, index) => {
                const IconComponent = iconMap[item.type]

                return (
                  <div key={index}>
                    <div className={clsx('flex flex-row items-center hover:bg-gray-100 rounded-md')}>
                      <FileCard
                        name={item.name}
                        tags={item.tags}
                        excerpt={item.excerpt}
                        itemProps={{
                          onPress: () => {
                            selectedKeys !== "all" && selectedKeys.has(`${index}`) ? setSelectedKeys(new Set([`${index}`])) : setSelectedKeys(new Set([]))
                            // onCheckboxChange(item.id)
                          },
                          startContent: (
                            <>
                              <Checkbox
                                className="pe-[16px]"
                                isSelected={isItemSelected(item.id)}
                                onValueChange={() => onCheckboxChange(item.id)}
                              />
                            </>
                          ),
                        }}
                        icon={<IconComponent />}
                        extension={item.extension || ''}
                        selectedKeys={selectedKeys}
                        setSelectedKeys={setSelectedKeys}
                        fileIndex={index}
                      >
                        <FileInfo item={item} />
                      </FileCard>
                    </div>
                  </div>
                )
              })}
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
