// context-card.tsx

import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import { useContextCardStyles, useContextCardCreditStyles } from './context-card.styles';
import { ContextCardProps, ContextCardCreditProps } from "./context-card.types";
import React, { FC } from 'react';

const ContextCardCredit: FC<ContextCardCreditProps> = ({ 
    contextName,
    contextOwner,
    style,
}) => {
    const styles = useContextCardCreditStyles();
    return (
        <div style={style}>
            <p style={styles.contextNameText}>{contextName}</p>
            <div style={styles.contextCreditContainer}>
                {contextOwner.images && 
                    <Image
                        src={contextOwner.images[0].url}
                        roundedCircle
                        style={styles.ownerAvatar}
                    />
                }
                <div>
                    {contextOwner.type === 'user'
                        ? contextOwner.display_name
                        : contextOwner.name
                    }
                </div>
            </div>
        </div>
    );
}

export const ContextCard: FC<ContextCardProps> = ({
    context,
    contextOwner,
    cardColor,
}) => {
    const styles = useContextCardStyles();
    const contextArtUrl = context.images[0].url;
    
    return (
        <Card style={styles.card(cardColor)}>
            <Image
                src={contextArtUrl}
                style={styles.contextArt}
            />
            <ContextCardCredit
                contextName={context.name}
                contextOwner={contextOwner}
                style={styles.contextCredit}
            />
        </Card>
    );
};
