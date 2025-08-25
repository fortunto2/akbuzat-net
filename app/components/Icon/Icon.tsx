import {
	ArrowDownOnSquareIcon,
	ArrowUpOnSquareIcon,
	ArrowsPointingInIcon,
	ArrowsPointingOutIcon,
	BugAntIcon,
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	ClipboardDocumentCheckIcon,
	ClipboardDocumentIcon,
	Cog6ToothIcon,
	ComputerDesktopIcon,
	EllipsisVerticalIcon,
	ExclamationCircleIcon,
	ExclamationTriangleIcon,
	HandRaisedIcon,
	LockClosedIcon,
	MicrophoneIcon,
	MinusIcon,
	PhoneIcon,
	PhoneXMarkIcon,
	PlusIcon,
	ServerStackIcon,
	ShieldCheckIcon,
	SignalIcon,
	SignalSlashIcon,
	UserGroupIcon,
	UsersIcon,
	VideoCameraIcon,
	VideoCameraSlashIcon,
	WifiIcon,
	XCircleIcon,
} from '@heroicons/react/20/solid'
import type { FC } from 'react'
import { cn } from '~/utils/style'
import { MicrophoneSlashIcon } from './custom/MicrophoneSlashIcon'

const iconMap = {
	micOn: MicrophoneIcon,
	micOff: MicrophoneSlashIcon,
	videoOn: VideoCameraIcon,
	videoOff: VideoCameraSlashIcon,
	screenshare: ComputerDesktopIcon,
	arrowsOut: ArrowsPointingOutIcon,
	arrowsIn: ArrowsPointingInIcon,
	cog: Cog6ToothIcon,
	xCircle: XCircleIcon,
	bug: BugAntIcon,
	PhoneIcon,
	phoneXMark: PhoneXMarkIcon,
	handRaised: HandRaisedIcon,
	userGroup: UserGroupIcon,
	LockClosedIcon,
	PlusIcon,
	MinusIcon,
	CheckIcon,
	ChevronUpIcon,
	ChevronDownIcon,
	EllipsisVerticalIcon,
	ClipboardDocumentCheckIcon,
	ClipboardDocumentIcon,
	SignalIcon,
	SignalSlashIcon,
	ExclamationCircleIcon,
	ExclamationTriangleIcon,
	ServerStackIcon,
	ShieldCheckIcon,
	ArrowDownOnSquareIcon,
	ArrowUpOnSquareIcon,
	WifiIcon,
	UsersIcon,
}

interface IconProps {
	type: keyof typeof iconMap
}

export const Icon: FC<
	IconProps & Omit<JSX.IntrinsicElements['svg'], 'ref'>
> = ({ type, className, ...rest }) => {
	const Component = iconMap[type]
	return <Component className={cn('h-[1em]', className)} {...rest} />
}
