import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
interface TagItem {
    id: string
    label: string
    checked: boolean
    category: string
}

interface TagPopupProps {
    data: TagItem[]
    onOk: (param: TagItem[]) => void
    onCancel: () => void
}

const groupByCategory = (list: TagItem[]) => {
    const result: { category: string, items: TagItem[] }[] = [];
    const categories = Array.from(new Set<string>(list.map(e => e.category)))
    for (let category of categories) {
        result.push({
            category,
            items: list.filter(e => e.category === category)
        })
    }

    return result;
}

const TagPopup = ({ data = [], onOk, onCancel }: TagPopupProps) => {

    const [items, setItems] = useState<TagItem[]>([]);
    useEffect(() => {
        setItems(v => {
            return data.map(e => ({
                ...e
            }))
        })
    }, [data]);

    const onTagClick = (item: TagItem) => {
        //TODO: implement logic here -> update items array
    }

    const groups = groupByCategory(items);
    return (
        <TagPopupContainer>
            <div>
                {
                    groups.map(g => (
                        <div key={g.category}>
                            <div>{g.category}</div>
                            <div>
                                {
                                    g.items.map(item => (
                                        <TagContainer
                                            key={item.id}
                                            onClick={() => onTagClick(item)}
                                            className={item.checked ? 'active' : ''}
                                        >
                                            {item.label}
                                        </TagContainer>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            <div>
                <button onClick={() => onOk(items)}>
                    OK
                </button>
                <button onClick={() => onCancel()}>
                    Cancel
                </button>
            </div>

        </TagPopupContainer>
    )
}



const TagPopupContainer = styled.div`
    //styling here
`
const TagContainer = styled.div`
    //styling here
`
