// playlist-card.tsx

import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image'
import { usePlaylistCardStyles, usePlaylistCardCreditStyles } from './playlist-card.styles';
import { PlaylistCardCreditProps, PlaylistCardProps } from "./playlist-card.types";
import { extractProminentColor } from '../../../common/functions';
import { useEffect, useState } from 'react';

const PlaylistCardCredit: React.FC<PlaylistCardCreditProps> = ({ 
    playlistTitle,
    playlistOwner,
    style,
}) => {
    const styles = usePlaylistCardCreditStyles();
    
    return (
        <div style={style}>
            <p style={styles.playlistTitleText}>{playlistTitle}</p>
            <div style={styles.playlistOwnerFooter}>
                {playlistOwner.images && 
                    <Image
                        src={playlistOwner.images[0].url}
                        roundedCircle
                        style={styles.ownerAvatar}
                    />
                }
                <p style={styles.playlistOwnerText}>{playlistOwner.display_name}</p>
            </div>
        </div>
    );
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
    playlist,
    playlistOwner
}) => {
    const styles = usePlaylistCardStyles();
    const playlistArtUrl = playlist.images[0].url;
    const [cardColor, setCardColor] = useState('#992264');

    useEffect(() => {
        extractProminentColor(playlistArtUrl).then(color => {
            setCardColor(color)
        })
    }, []);
    
    return (
        <Card style={styles.card(cardColor)}>
            <Image
                src={playlistArtUrl}
                style={styles.playlistArt}
            />
            <PlaylistCardCredit
                playlistTitle={playlist.name}
                playlistOwner={playlistOwner}
                style={styles.playlistCredit}
            />
        </Card>
    );
};
