// main-page.tsx

import Button from "react-bootstrap/Button";
import { MixerCard } from "../components/cards/mixer-card";
import { BsFilePlayFill, BsFilePlusFill } from 'react-icons/bs'
import { ContextCardProps } from "../components/cards/context-card/context-card.types";

type MainPageProps = {
    redirectTo: (to: string) => void,
    contextCards: ContextCardProps[],
};

export const MainPage = ({
    redirectTo,
    contextCards
}: MainPageProps) => {
    const buttonStyling = 'absolute top-0 rounded-2xl flex flex-col gap-2 justify-center items-center h-full w-full enabled:text-white font-semibold tracking-wide hover:bg-black/20 disabled:bg-black/50 disabled:text-gray-400'
    return (
        <div className='flex flex-row gap-8'>
            <MixerCard color='#4dc98b'>
                <Button
                    disabled={contextCards.length === 0}
                    bsPrefix={buttonStyling}
                    onClick={() => redirectTo('/player')}
                >
                    <BsFilePlayFill className='text-[5rem]' />
                    {'play'}
                </Button>
            </MixerCard>
            <MixerCard color='#6175b8'>
                <Button
                    bsPrefix={buttonStyling}
                    onClick={() => redirectTo('/select')}
                >
                    <BsFilePlusFill className='text-[5rem]' />
                    {'select'}
                </Button>
            </MixerCard>
        </div>
    )
}
