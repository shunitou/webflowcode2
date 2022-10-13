import { signIn } from 'next-auth/react';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { useRouter } from 'next/router';
import { InjectedConnector } from 'wagmi/connectors/injected';
import axios from 'axios';
import styles from "../styles/Home.module.css";

function SignIn() {
    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { push } = useRouter();    

    const handleAuth = async () => {

        if (isConnected) {
            await disconnectAsync();
        }

        const { account, chain } = await connectAsync({ connector: new InjectedConnector() });

        const userData = { address: account, chain: chain.id, network: 'evm' };

        const { data } = await axios.post('/api/auth/request-message', userData, {
            headers: {
                'content-type': 'application/json',
            },
        });

        const message = data.message;

        const signature = await signMessageAsync({ message });

        const { url } = await signIn('credentials', { message, signature, redirect: false, callbackUrl: '/user' });

        push(url);
    };

    return (
 

        <div>
         <h1 className={styles.h1}>Auth - NFT Gated Content</h1>
      <p className={styles.explain}> Serve exclusive content to users who own an NFT from your collection,
        using{" "}</p>
        <b>
          <a
            href="https://portal.thirdweb.com/building-web3-apps/authenticating-users"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.purple}
          >
            Auth
          </a>
        </b>
        <p className={styles.explain}>
        You cannot access the main page unless you own an NFT from our
        collection!
      </p>
      <hr className={styles.divider} />


        <button  className={styles.mainButton} style={{ width: 256 }} onClick={() => handleAuth()}>Authenticate via Metamask</button>

        </div>
    );
}

export default SignIn;