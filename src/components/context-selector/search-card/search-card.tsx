// search-card.tsx

import React, {
    FC,
    useCallback,
    useMemo,
    useState
} from 'react';
import AsyncSelect from 'react-select/async';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import {
    alterColor,
    brightnessLevel,
    extractProminentColors,
    levenshteinDistance as levDist
} from '../../../common/functions';
import {
    ContextPreviewProps,
    SearchCardProps,
    SearchContextState,
    SearchOption,
    SearchOptionLabelProps,
    SelectedSearchOption,
    SelectRef
} from './search-card.types';
import { ContextCardProps } from '../context-card/context-card.types';
import {
    useContextPreviewStyles,
    useSearchCardStyles,
    useSearchOptionLabelStyles
} from './search-card.styles';


const ContextPreview: FC<ContextPreviewProps> = ({
    context,
    prominentColors,
    createContextCard,
}) => {
    const styles = useContextPreviewStyles();

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

    const onClick = useCallback(async () => {
        createContextCard(context);
    }, [createContextCard]);

    return (
        <div style={styles.container}>
            <Image
                src={context.images[0].url}
                style={styles.contextArt}
            />
            <Button
                onClick={onClick}
                style={styles.button(buttonColor)}
            >
                {`Add ${'owner' in context ? 'Playlist' : 'Album'}`}
            </Button>
        </div>
    );
};


const SearchOptionLabel: FC<SearchOptionLabelProps> = ({
    context
}) => {
    const styles = useSearchOptionLabelStyles();
    return (
        <div style={styles.container}>
            <Image
                src={context.images.at(-1)?.url}
                style={styles.contextArt}
            />
            <div style={styles.creditsContainer}>
                <div>{context.name}</div>
                <div style={styles.contextOwnerText}>
                    {
                        'owner' in context
                            ? `Playlist • ${context.owner.display_name}`
                            : 'Album'
                    }
                </div>
            </div>
        </div>
    )
};


export const SearchCard: FC<SearchCardProps> = ({
    spotifyClient,
    addContextCard,
}) => {
    const styles = useSearchCardStyles();

    const [context, setContext] = useState<SearchContextState | null>(null);
    const [prominentColors, setProminentColors] = useState<string[]>([]);
    const [selectRef, setSelectRef] = useState<SelectRef | null>(null);

    const loadOptions = useCallback(
        async (query: string): Promise<SearchOption[]> => {
            const result = await spotifyClient.search(
                query, ['album', 'playlist'], { limit: 10 }
            );

            let options: SearchOption[] = [];

            if (result.albums) {
                options = [
                    ...options,
                    ...result.albums.items.map(
                        album => ({ value: album } as SearchOption)
                    )
                ];
            }

            if (result.playlists) {
                options = [
                    ...options,
                    ...result.playlists.items.map(
                        playlist => ({ value: playlist } as SearchOption)
                    )
                ];
            }
            options.sort(
                (a, b) => levDist(query, a.value.name) - levDist(query, b.value.name)
            );

            return options
    }, [spotifyClient]);

    const formatOptionLabel = useCallback(
        (option: SearchOption) => {
            return <SearchOptionLabel context={option.value} />;
    }, []);

    const onChange = useCallback(
        (selectedOption: SelectedSearchOption) => {
            if (!selectedOption) {
                setContext(null);
                return;
            }
            extractProminentColors(
                selectedOption.value.images[0].url
            ).then(colors => {
                setProminentColors(colors);

                setContext({
                    ...selectedOption.value,
                    cardColor: colors[0],
                });
            })
    }, []);

    const createContextCard = useCallback(
        async (context: SearchContextState) => {

            let contextCard: ContextCardProps;

            if ('owner' in context) {
                const playlist = await spotifyClient.getPlaylist(context.id);
                const user = await spotifyClient.getUser(context.owner.id);

                contextCard = {
                    context: playlist,
                    contextOwner: user,
                    key: context.id,
                    cardColor: context.cardColor,
                };
            } 
            else {
                const album = await spotifyClient.getAlbum(context.id);
                const artist = await spotifyClient.getArtist(
                    album.artists[0].id
                );

                contextCard = {
                    context: album,
                    contextOwner: artist,
                    key: context.id,
                    cardColor: context.cardColor,
                };
            }

            selectRef?.clearValue();
            addContextCard(contextCard);
    }, [addContextCard, spotifyClient, selectRef]);

    return (
        <Card style={styles.card}>
            { context && 
                <ContextPreview
                    context={context}
                    createContextCard={createContextCard}
                    prominentColors={prominentColors}
                />
            }
            <div style={styles.selectContainer}>
                <AsyncSelect
                    formatOptionLabel={formatOptionLabel}
                    ref={ref => setSelectRef(ref)}
                    loadOptions={loadOptions}
                    escapeClearsValue
                    placeholder={'Search...'}
                    styles={styles.select}
                    onChange={onChange}
                    isLoading={false}
                />
            </div>
        </Card>
    );
};
