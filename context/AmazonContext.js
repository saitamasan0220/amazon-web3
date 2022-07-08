import {createContext, useState, useEffect} from 'react'
import {useMoralis, useMoralisQuery} from 'react-moralis'
import {amazonAbi, amazonCoinAddress} from '../lib/constants'
import {ethers} from 'ethers'


export const AmazonContext = createContext()

export const AmazonProvider = ({children}) => {

    const [username, setUsername] = useState('')
    const [nickname, setNickname] = useState('')
    const [assets, setAssets] = useState([])
    const [currentAccount, setCurrentAccount] = useState('')
    const [tokenAmount, setTokenAmount] = useState('')
    const [amountDue, setAmountDue] = useState('')
    const [etherscanLink, setEtherscanLink] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [balance, setBalance] = useState('')
    const [recentTransactions, setRecentTransactions] = useState([])
    const [ownedItems, setOwnedItems] = useState([])

    const {
        authenticate,
        isAuthenticated,
        enableWeb3,
        Moralis,
        user,
        isWeb3Enabled,
    } = useMoralis()

    const {
        data: assetsData,
        error: assetsDataError,
        isLoading: assetsDataIsLoading
    } = useMoralisQuery('assets')

    const {
        data: userData,
        error: userDataError,
        isLoading: userDataisLoading
    } = useMoralisQuery('_User')

    const getBalance = async () => {
        try {
            if(!isAuthenticated || !currentAccount) return

            const options = {
                contractAddress: amazonCoinAddress,
                functionName: 'balanceOf',
                abi: amazonAbi,
                params: {
                    account: currentAccount
                }
            }

            if(isWeb3Enabled) {
                const response = await Moralis.executeFunction(options)
                setBalance(response.toString())
            }
        } catch (error) {
            console.log(error)
        }
    }

    const listenToUpdates = async () => {
        let query = new Moralis.Query('EthTransactions')
        console.log("LISTENING")
        let subscription = await query.subscribe()
        subscription.on('update', async object => {
            console.log('New Transaction')
            console.log(object)
            setRecentTransactions([object])
        })
    }

    // useEffect(async () => {
    //     // console.log(assetsData)
    //     await enableWeb3()
    //     await getAssets()
    //     await getOwnedAssets()
    // }, [userData, assetsData, assetsDataIsLoading, userDataisLoading])

    useEffect(() => {
        ;(async() => {
            if(isWeb3Enabled){
                await getAssets()
                await getOwnedAssets()
            } else {
                await enableWeb3()
            }
        })()
    }, [isWeb3Enabled, assetsData, assetsDataIsLoading, userDataisLoading])

    useEffect(() => {
        ;(async() => {

            if (!isWeb3Enabled) {
                await enableWeb3()
            }

            if(isAuthenticated) {
                await getBalance()
                const currentUsername = await user?.get('nickname')
                setUsername(currentUsername)
                const account = await user?.get('ethAddress')
                setCurrentAccount(account)
            }
        })()
    }, [isAuthenticated, user, username, currentAccount, balance, getBalance, listenToUpdates])

    const handleSetUsername = () => {
        if (user) {
            if(nickname) {
                user.set('nickname', nickname) // add nickname column to Moralis databse
                user.save()
                setNickname('')
            } else {
                console.log("Can't set empyt nickname")
            }
        } else {
            console.log('No user')
        }
    }

    const buyAsset = async (price, asset) => {
        try {
            if(!isAuthenticated) return

            const options = {
                type: 'erc20',
                amount: price,
                receiver: amazonCoinAddress,
                contractAddress: amazonCoinAddress
            }

            let transaction = await Moralis.transfer(options)
            const receipt = await transaction.wait()
            console.log("RUNNING: ", receipt)
            if(receipt) {
                console.log("WAITING FOR RECEIPT")
                const res = userData[0].add('ownedAssets', {
                    ...asset,
                    purchaseDate: Date.now(),
                    etherscanLink: `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`
                })
                await res.save().then(() => {
                    alert("You've successfully purchased this asset")
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const buyTokens = async () => {
        if(!isAuthenticated) {
            await authenticate()
        }

        const amount = ethers.BigNumber.from(tokenAmount)
        const price = ethers.BigNumber.from('100000000000000')
        const calcPrice = amount.mul(price)

        let options = {
            contractAddress: amazonCoinAddress,
            functionName: 'mint',
            abi: amazonAbi,
            msgValue: calcPrice,
            params: {
                amount,
            }
        }

        const transaction = await Moralis.executeFunction(options)
        const receipt = await transaction.wait(4)
        setIsLoading(false)
        console.log(receipt)
        setEtherscanLink(
            `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`
        )
    }

    const getAssets = async () => {
        try {
            await enableWeb3()
            setAssets(assetsData)
        } catch (error) {
            console.log(error)
        }
    }

    const getOwnedAssets = async () => {
        try {
            // if(userData[0] && userData[0].attributes.ownedAssets) {
            // if(userData[0].attributes.ownedAssets) {
            if(userData[0]) {

                console.log('userData[0]: ', userData[0]);
                console.log('userData[0].attributes.ownedAssets: ', userData[0].attributes.ownedAssets);

                // setOwnedItems(prevItems => {
                //     console.log('prevItems: ', prevItems);
                    
                //     [...prevItems, userData[0].attributes.ownedAssets]
                // })

                setOwnedItems(                    
                    [userData[0].attributes.ownedAssets]
                )
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AmazonContext.Provider
            value={{
                isAuthenticated,
                nickname,
                setNickname,
                username,
                handleSetUsername,
                assets,
                balance,
                setTokenAmount,
                tokenAmount,
                amountDue,
                setAmountDue,
                isLoading,
                setIsLoading,
                setEtherscanLink,
                etherscanLink,
                currentAccount,
                buyTokens,
                buyAsset,
                recentTransactions,
                ownedItems
            }}
        >
            {children}
        </AmazonContext.Provider>
    )
}