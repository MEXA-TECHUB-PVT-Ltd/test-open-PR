import React, { Component, useEffect } from 'react';
import { Text, FlatList, StyleSheet, SafeAreaView, View } from 'react-native';
import colors from '../../../../theme/colors';
import TransactionListItem from '../../../../components/TransactionListItem';
import fonts from '../../../../theme/fonts';
import MyWalletHeader from '../../Components/MyWalletHeader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../../../redux/paymentMethod/getTransactionsSlice';
import FullScreenLoader from '../../../../components/CustomLoader';


const MyWallet = ({ navigation }) => {
    const dispatch = useDispatch();
    const { transactions, status } = useSelector((state) => state.transactions)
    const { user_id } = useSelector((state) => state.anyData);

    useEffect(() => {
        dispatch(fetchTransactions({ coach_id: user_id }))
    }, [dispatch, user_id])

    return (
        <View style={styles.container}>

            <MyWalletHeader
                amount={transactions?.result?.wallet?.balance !== undefined ? `${transactions?.result?.wallet?.balance} CHF` : 'N/A'}
                navigation={navigation}
                status={status}
            />

            <View style={{ margin: 20, flex: 1 }}>
                <Text style={{
                    fontFamily: fonts.fontsType.semiBold,
                    fontSize: 17,
                    color: '#212121',
                }}>Transaction History</Text>
                {
                    status == 'loading' ? <FullScreenLoader visible={status} /> :
                        transactions?.result?.transactions.length > 0 ? <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{ marginBottom: 20 }}
                            data={transactions?.result?.transactions}
                            renderItem={({ item }) => (
                                <TransactionListItem
                                    amount={item.amount}
                                    //currency={item.currency}
                                    date={item.date}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString() + item}
                        /> :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{
                                    fontFamily: fonts.fontsType.medium,
                                    fontSize: 16,
                                    color: colors.primaryColor,
                                }}>No Data Available</Text>
                            </View>
                }

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});

export default MyWallet;
