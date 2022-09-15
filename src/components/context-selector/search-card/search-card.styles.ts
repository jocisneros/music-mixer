// search-card.styles.ts

import React, { useMemo, CSSProperties } from "react";
import { pxToRem } from "../../../common/functions";
import { SelectStyles } from "./search-card.types";

type SearchCardStyles = {
    card: CSSProperties,
    selectContainer: CSSProperties,
    select: SelectStyles,
};

type SearchOptionLabelStyles = {
    container: CSSProperties,
    contextArt: CSSProperties,
    creditsContainer: CSSProperties,
    contextOwnerText: CSSProperties,
};

type ContextPreviewStyles = {
    container: CSSProperties,
    contextArt: CSSProperties,
    button: (color: string) => CSSProperties,
};

export const useContextPreviewStyles = () => {
    return useMemo((): ContextPreviewStyles => {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: pxToRem(8),
            },
            contextArt: {
                borderRadius: pxToRem(16),
                height: pxToRem(210),
                maxWidth: pxToRem(210),
                objectFit: 'cover',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            },
            button: (color: string) => {
                return {
                    background: color,
                    border: 'none',
                    borderRadius: pxToRem(16),
                    fontWeight: 650,
                    fontSize: pxToRem(14),
                    padding: `${pxToRem(8)} ${pxToRem(16)}`
                };
            }
        };
    }, []);
};

export const useSearchOptionLabelStyles = () => {
    return useMemo((): SearchOptionLabelStyles => {
        return {
            container: {
                display: 'flex',
                flexDirection: 'row',
                gap: pxToRem(5),
                height: '100%',
                width: '100%',
                alignItems: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
            },
            contextArt: {
                height: pxToRem(40),
                maxWidth: pxToRem(40),
                borderRadius: pxToRem(8),
                objectFit: 'cover',
            },
            creditsContainer: {
                display: 'flex',
                flexDirection: 'column',
                fontSize: pxToRem(14)
            },
            contextOwnerText: {
                color: "#ccc",
                fontSize: pxToRem(12)
            },
        };
    }, []);
};

export const useSearchCardStyles = () => {
    return useMemo((): SearchCardStyles => {
        return {
            card: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: pxToRem(250),
                height: pxToRem(350),
                borderRadius: '16px',
                background: '#191414',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                border: 'none',
                paddingTop: pxToRem(20),
            },
            selectContainer: {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
            },
            select: {
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
                    padding: '5px 5px 5px',
                }),
                option: (provided, state) => ({
                    ...provided,
                    padding: '0 5px 0',
                    display: 'flex',
                    height: pxToRem(50),
                    alignItems: 'center',
                })
            },
        };
    }, []);
};
