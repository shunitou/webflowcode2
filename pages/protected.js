import { getSession } from 'next-auth/react';
import Moralis from 'moralis';
import { useRouter } from 'next/router';

function Protected({message, nftList}) {
    const {push} = useRouter();

    return (
        <div>
            <button onClick={()=> push('/user')}>Profile</button>
            <h3>Protected content</h3>
            <div>{message}</div>

            <pre>{JSON.stringify(nftList, null, 2)}</pre>
        </div>
    );
}


export async function getServerSideProps(context) {

    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }

    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

    const nftList = await Moralis.EvmApi.account.getNFTsForContract({
        address: session.user.address,
        tokenAddress: '0x082A2142B01Fb4a27B0Fa8002017F286AbaaF059',
        chain: 1 // defualt 1 (ETH)
    });

    return {
        props: {
            message:
                nftList.raw.total > 0 ? 'Nice! You have our NFT' : "Sorry, you don't have our NFT",
            nftList: nftList.raw.result
        },
    };
    
}

export default Protected;