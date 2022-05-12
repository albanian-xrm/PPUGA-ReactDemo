import React from 'react';

import { IView360Props } from '@ppuga/demo/contact/View360.types';

const View360 = ({ isNew }: IView360Props) =>
    <p>
        {isNew ?
            <p>Creating contact</p> :
            <p>Editing contact </p>
        }
    </p>

export default View360;