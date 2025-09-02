import { bind } from 'decko';
import { Component, h } from 'preact';
import { Xterm, XtermOptions } from './xterm';

import '@xterm/xterm/css/xterm.css';
import { Modal } from '../modal';

interface Props extends XtermOptions {
    id: string;
}

interface State {
    modal: boolean;
}

export class Terminal extends Component<Props, State> {
    private container: HTMLElement;
    private xterm: Xterm;

    // this does not affect visual state
    private isKf: boolean;

    constructor(props: Props) {
        super();
        this.xterm = new Xterm(props, this.showModal);
    }

    async componentDidMount() {
        await this.xterm.refreshToken();
        this.xterm.open(this.container);
        this.xterm.connect();
    }

    componentWillUnmount() {
        this.xterm.dispose();
    }

    render({ id }: Props, { modal }: State) {
        return (
            <div id={id} ref={c => (this.container = c as HTMLElement)}>
                <Modal show={modal}>
                    <label class="file-label">
                        <input onChange={this.sendFile} class="file-input" type="file" multiple />
                        <span class="file-cta">Choose files…</span>
                    </label>
                </Modal>
            </div>
        );
    }

    @bind
    showModal(isKf?: boolean) {
        if (isKf) {
            this.isKf = isKf;
        }

        this.setState({ modal: true });
    }

    @bind
    sendFile(event: Event) {
        if (this.isKf) {
            this.isKf = false;
            this.setState({ modal: false });
            const files = (event.target as HTMLInputElement).files;
            if (files) this.xterm.sendCredFile(files);
        } else {
            this.setState({ modal: false });
            const files = (event.target as HTMLInputElement).files;
            if (files) this.xterm.sendFile(files);
        }
    }
}
