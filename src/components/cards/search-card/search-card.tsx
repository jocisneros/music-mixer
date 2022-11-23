// search-card.tsx

import {
    useCallback,
    useMemo,
    useState
} from 'react';
import AsyncSelect from 'react-select/async';
import Button from 'react-bootstrap/Button';
import {
    alterColor,
    brightnessLevel,
    extractProminentColors,
    levenshteinDistance as levDist,
    pxToRem
} from '../../../common/functions';
import {
    ContextPreviewProps,
    SearchCardProps,
    SearchContextState,
    SearchOption,
    SearchOptionLabelProps,
    SelectedSearchOption,
} from './search-card.types';
import Spinner from 'react-bootstrap/Spinner';
import { MixerCard } from '../mixer-card';


const ContextPreview = ({
    context,
    prominentColors,
    createContextCard,
}: ContextPreviewProps) => {
    const buttonColor = useMemo(() => {
        let buttonColor = '';
        for (let color of prominentColors) {
            if (brightnessLevel(color) <= 155 && brightnessLevel(color) >= 30) {
                buttonColor = color;
                break;
            }
        }

        if (buttonColor === '') {
            const brightness = brightnessLevel(prominentColors[0]);
            if (brightness > 155) {
                buttonColor = alterColor(prominentColors[0], 0.8);
            } else if (brightness < 30) {
                buttonColor = alterColor(prominentColors[0], 1.2);
            } else {
                buttonColor = prominentColors[0];
            }
        }

        return buttonColor;
    }, [prominentColors]);

    return (
        <div className='flex flex-col items-center gap-2'>
            <img
                src={context.images[0].url}
                alt={`art for '${context.name}'`}
                className='object-cover shadow-lg rounded-2xl h-[13.625rem] max-w-[13.625rem]'
            />
            <Button
                onClick={async () => createContextCard(context)}
                bsPrefix='border-none rounded-2xl font-bold text-sm py-2 px-4 text-white'
                style={{ background: buttonColor }}
            >
                {`Add ${'owner' in context ? 'Playlist' : 'Album'}`}
            </Button>
        </div>
    );
};


const SearchOptionLabel = ({
    context
}: SearchOptionLabelProps) => {
    const creditText = useMemo(() => {
        if ('owner' in context) {
            return 'Playlist • ' + context.owner.display_name;
        }
        return 'Album';
    }, [context])
    return (
        <div
            className='flex flex-row gap-2 h-full w-full items-center overflow-hidden whitespace-nowrap text-ellipsis'
        >
            <img
                src={context.images.at(-1)?.url}
                alt={`art for '${context.name}'`}
                className='h-10 w-10 rounded-xl object-cover'
            />
            <div className='flex-col text-sm'>
                {context.name}
                <div className='text-xs text-slate-400'>{creditText}</div>
            </div>
        </div>
    )
};


export const SearchCard = ({
    search,
    getPlaylist,
    getUser,
    getAlbum,
    getArtist,
    addContextCard,
}: SearchCardProps) => {
    const [context, setContext] = useState<SearchContextState | null>(null);
    const [prominentColors, setProminentColors] = useState<string[]>([]);
    const [isLoading, setLoading] = useState(false);

    const loadQueryResults = useCallback(
        async (query: string): Promise<SearchOption[]> => {
            const { albums, playlists} = await search(
                query, ['album', 'playlist'], { limit: 10 }
            );
            
            function resultsMap(value: any) {
                return { value: value } as SearchOption
            }

            const albumResults = albums 
                ? [...albums.items.map(resultsMap)]
                : [];

            const playlistResults = playlists 
                ? [...playlists.items.map(resultsMap)]
                : [];

            const options = albumResults.concat(playlistResults);
            options.sort(
                (a, b) => levDist(query, a.value.name) - levDist(query, b.value.name)
            );

            return options;
    }, [search]);

    const onSelection = useCallback(
        (selectedOption: SelectedSearchOption) => {
            if (!selectedOption) {
                setContext(null);
                return;
            }
            setLoading(true);
            extractProminentColors(
                selectedOption.value.images[0].url
            ).then(colors => {
                setProminentColors(colors);
                setLoading(false);
                setContext({
                    ...selectedOption.value,
                    cardColor: colors[0],
                });
            })
    }, []);

    const createContextCard = useCallback(
        async ({ id, cardColor, ...context }: SearchContextState) => {
            let album: SpotifyApi.SingleAlbumResponse;
            addContextCard({
                key: id,
                cardColor: cardColor,
                ...(
                    'owner' in context
                    ? { 
                        context: await getPlaylist(id), 
                        contextOwner: await getUser(context.owner.id)
                    }
                    : {
                        context: album = await getAlbum(id),
                        contextOwner: await getArtist(album.artists[0].id)
                    }
                )
            });
    }, [addContextCard, getAlbum, getArtist, getPlaylist, getUser]);

    const contextPreviewLoader = useMemo(() => {
        if (context) {
            return (
                <ContextPreview
                    context={context}
                    createContextCard={createContextCard}
                    prominentColors={prominentColors}
                />
            );
        }
        if (isLoading) {
            return (
                <div className='flex justify-center items-center h-full'>
                    <Spinner animation={'border'} variant='light'/>
                </div>
            );
        }
    }, [context, isLoading, prominentColors, createContextCard])

    return (
        <MixerCard>
            <div className='flex flex-col items-center justify-center gap-2 h-full w-full'>
                {contextPreviewLoader}
                <AsyncSelect
                    formatOptionLabel={option => (
                        <SearchOptionLabel context={option.value} />
                    )}
                    loadOptions={loadQueryResults}
                    escapeClearsValue
                    placeholder={'Search...'}
                    styles={{
                        control: () => ({
                            display: 'flex',
                            flexDirection: 'row',
                            width: pxToRem(200),
                            maxWidth: pxToRem(200),
                            border: 'none',
                            borderRadius: pxToRem(16),
                            background: '#ffffff',
                        }),
                        valueContainer: (provided, state) => ({
                            ...provided,
                            padding: pxToRem(5),
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            padding: `0 ${pxToRem(5)} 0`,
                            display: 'flex',
                            height: pxToRem(50),
                            alignItems: 'center',
                        })
                    }}
                    onChange={onSelection}
                />
            </div>
        </MixerCard>
    );
};
