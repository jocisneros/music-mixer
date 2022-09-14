// playlist-card.styles.ts

import React, { useMemo } from "react";
import { pxToRem } from "../../../common/functions";

type PlaylistCardStyles = {
    card: (backgroundColor: string) => React.CSSProperties,
    playlistArt: React.CSSProperties,
    playlistCredit: React.CSSProperties,
};

type PlaylistCardCreditStyles = {
    playlistTitleText: React.CSSProperties,
    playlistOwnerFooter: React.CSSProperties,
    playlistOwnerText: React.CSSProperties,
    ownerAvatar: React.CSSProperties,
};

export const usePlaylistCardCreditStyles = () => {
    return useMemo((): PlaylistCardCreditStyles => {
        return {
            playlistTitleText: {
                fontWeight: 650,
                fontSize: pxToRem(19),
                color: 'white',
                padding: 0,
                margin: 0,
            },
            playlistOwnerFooter: {
                display: 'flex',
                flexDirection: 'row',
                gap: pxToRem(8),
            },
            playlistOwnerText: {
                fontWeight: 650,
                fontSize: pxToRem(14),
                color: 'white',
            },
            ownerAvatar: {
                height: pxToRem(20),
                padding: 0,
                margin: 0,
            },
        };
    }, []);
};

export const usePlaylistCardStyles = () => {
    return useMemo((): PlaylistCardStyles => {
        return {
            card: (backgroundColor: string) => {
                return {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: pxToRem(256),
                    height: pxToRem(352),
                    padding: `${pxToRem(16)} ${pxToRem(8)} 0`,
                    borderRadius: pxToRem(16),
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    backgroundImage: `linear-gradient(${backgroundColor}, #121312 225%)`,
                };
            },
            playlistArt: {
                borderRadius: pxToRem(16),
                height: pxToRem(224),
                maxWidth: pxToRem(224),
                objectFit: 'cover',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            },
            playlistCredit: {
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                gap: pxToRem(6),
                padding: `0 ${pxToRem(16)} 0`,
                margin: 0,
                bottom: pxToRem(3),
                width: '100%',
            },
        };
    }, []);
};
