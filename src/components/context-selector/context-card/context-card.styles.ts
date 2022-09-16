// context-card.styles.ts

import React, { useMemo } from "react";
import { pxToRem } from "../../../common/functions";

type ContextCardStyles = {
    card: (backgroundColor: string) => React.CSSProperties,
    contextArt: React.CSSProperties,
    contextCredit: React.CSSProperties,
};

type ContextCardCreditStyles = {
    contextNameText: React.CSSProperties,
    contextCreditContainer: React.CSSProperties,
    ownerAvatar: React.CSSProperties,
};

export const useContextCardCreditStyles = () => {
    return useMemo((): ContextCardCreditStyles => {
        return {
            contextNameText: {
                fontWeight: 650,
                fontSize: pxToRem(19),
                color: 'white',
                padding: 0,
                margin: 0,
            },
            contextCreditContainer: {
                display: 'flex',
                flexDirection: 'row',
                gap: pxToRem(8),
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

export const useContextCardStyles = () => {
    return useMemo((): ContextCardStyles => {
        return {
            card: (backgroundColor: string) => {
                return {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: pxToRem(250),
                    height: pxToRem(350),
                    padding: `${pxToRem(12)} ${pxToRem(8)}`,
                    borderRadius: pxToRem(16),
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    backgroundImage: `linear-gradient(${backgroundColor}, #121312 500%)`,
                    border: 'none',
                };
            },
            contextArt: {
                borderRadius: pxToRem(16),
                height: pxToRem(225),
                maxWidth: pxToRem(225),
                objectFit: 'cover',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            },
            contextCredit: {
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                gap: pxToRem(6),
                padding: `0 ${pxToRem(16)} 0`,
                margin: 0,
                bottom: pxToRem(12),
                left: 0,
                width: '100%',
            },
        };
    }, []);
};
