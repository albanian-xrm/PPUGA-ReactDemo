import React from 'react';

import { Dropdown, IDropdownOption } from '@fluentui/react';
import { IView360Props } from '@ppuga/demo/contact/View360.types';

const dropdownOptions: IDropdownOption[] = [
    { key: 0, text: 'Is this cool?' },
    { key: 1, text: 'It must be cool, right?' }
]


const View360 = ({ isNew }: IView360Props) =>
    <p>
        {isNew ?
            <p>Creating contact</p> :
            <p>Editing contact : <Dropdown options={dropdownOptions} /></p>
        }
    </p>

export default View360;