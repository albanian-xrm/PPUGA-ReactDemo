import React, { useCallback, useEffect, useState } from "react";
import { render } from "react-dom";

import View360 from "@ppuga/demo/contact/View360";

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isNew, setIsNew] = useState<boolean>(false);
    const eventHandler = useCallback((eventContext: Xrm.Events.EventContext) => {
        const formContext = eventContext.getFormContext();
        setIsNew(formContext.ui.getFormType() === XrmEnum.FormType.Create);
    }, []);
    useEffect(() => {
        document.getElementById('loader')?.classList.add('sk-hidden');
        document.getElementById('root')?.classList.remove('sk-hidden');
        setIsLoading(false);
        parent.Xrm.Page.data.addOnLoad(eventHandler);

        const stateCode = parent.Xrm.Page.getAttribute('statecode');
        stateCode.addOnChange(eventHandler);
        stateCode.fireOnChange();
        stateCode.removeOnChange(eventHandler);
        return () => {
            parent.Xrm.Page.data.removeOnLoad(eventHandler);
        }
    }, []);

    return isLoading ? <></> : <View360 isNew={isNew} />
}

render(<App />, document.getElementById("root"));
