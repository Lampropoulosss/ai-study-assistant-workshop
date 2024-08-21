import {
  Accordion,
  AccordionItem,
  AccordionItemProps,
  AccordionProps,
  Chip,
} from '@nextui-org/react'
import React from 'react'
import type {Selection} from "@nextui-org/react";

export type FileCardProps = {
  name: string
  extension: string
  icon: React.ReactNode
  excerpt?: string
  tags?: string[]

  itemProps?: Partial<AccordionItemProps>

  selectedKeys: Selection
  setSelectedKeys(selectedKeys: Selection): void

  children?: React.ReactNode
} & Partial<AccordionProps>

export const FileCard: React.FC<FileCardProps> = ({
  name,
  extension,
  icon,
  tags,
  excerpt,
  itemProps = {},
  selectedKeys,
  setSelectedKeys,
  children,
  ...props
}) => {
  const displayName =
    !!extension && name.endsWith(extension)
      ? name.slice(0, name.length - (extension || '').length)
      : name
  const extensionChip = extension ? (
    <Chip color="primary" size="sm" radius="full" className="ms-2 opacity-90">
      {extension}
    </Chip>
  ) : null
  const title = (
    <>
      {displayName}
      {extensionChip}
    </>
  )

  const iconComponent = (
    <div className="w-6 h-6 flex items-center justify-center fill-primary-500">
      {icon}
    </div>
  )

  const startContent = (
    <div className="flex flex-row items-center">
      {itemProps.startContent}
      {iconComponent}
    </div>
  )

  const subtitle = (
    <div className="flex flex-row items-center justify-between">
      <div className="w-0 flex-grow pe-8 whitespace-nowrap overflow-hidden overflow-ellipsis">
        {excerpt || displayName}
      </div>
      <div className="flex flex-row gap-1">
        {(tags || []).slice(0, 2).map((tag, index) => (
          <Chip key={index} size="sm" radius="full">
            {tag}
          </Chip>
        ))}
      </div>
    </div>
  )

  return (
    <Accordion selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} isCompact {...props}>
      <AccordionItem
        title={title}
        subtitle={subtitle}
        startContent={startContent}
        key={name + extension}
        {...itemProps}
      >
        {children}
      </AccordionItem>
    </Accordion>
  )
}
