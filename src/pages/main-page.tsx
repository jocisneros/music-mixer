// main-page.tsx

import Button from 'react-bootstrap/Button';
import { BsFilePlayFill, BsFilePlusFill } from 'react-icons/bs'
import { ContextCardProps } from '../components/components';

type MainPageProps = {
    redirectTo: (to: string) => void,
    contextCards: ContextCardProps[],
};

export const MainPage = ({
    redirectTo,
    contextCards
}: MainPageProps) => {
    const buttonStyling = 'flex flex-row h-16 w-96 rounded-full gap-2 justify-center items-center enabled:text-white font-semibold tracking-wide hover:bg-black/20 disabled:bg-[#374369]/50 disabled:text-gray-400 '
    return (
        <div className='flex items-center justify-center h-screen w-screen'>
            <div className='flex flex-col flex-wrap h-[80vh] w-[30rem] rounded-[2rem] bg-black/20 gap-2 items-center justify-center'>
                <Button
                    bsPrefix={buttonStyling + 'bg-[#4dc98b3F]'}
                    onClick={() => redirectTo('/select')}
                >
                    <BsFilePlusFill className='text-[2rem]' />
                    {'select'}
                </Button>
                <Button
                    disabled={contextCards.length === 0}
                    bsPrefix={buttonStyling + 'bg-[#6175b83F]'}
                    onClick={() => redirectTo('/player')}
                >
                    <BsFilePlayFill className='text-[2rem]' />
                    {'play'}
                </Button>
            </div>
        </div>
    )
};
