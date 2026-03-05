import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const menuItems = [
  { id: 1, name: "Margherita Pizza", price: 450, img: "🍕", category: "Pizza" },
  { id: 2, name: "Cheeseburger Deluxe", price: 350, img: "🍔", category: "Burger" },
  { id: 3, name: "French Fries", price: 200, img: "🍟", category: "Sides" },
  { id: 4, name: "Grilled Chicken Sandwich", price: 480, img: "🥪", category: "Sandwich" },
  { id: 5, name: "Iced Latte", price: 250, img: "🧋", category: "Drinks" },
  { id: 6, name: "Chocolate Brownie", price: 180, img: "🍫", category: "Dessert" },
  { id: 7, name: "Caesar Salad", price: 300, img: "🥗", category: "Salad" },
  { id: 8, name: "Chicken Tikka Roll", price: 220, img: "🌯", category: "Wraps" },
  { id: 9, name: "Veggie Pizza Slice", price: 200, img: "🍕", category: "Pizza" },
  { id: 10, name: "Mango Smoothie", price: 180, img: "🥭", category: "Drinks" },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [userPic, setUserPic] = useState('👤');
  const [cartItems, setCartItems] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Track past orders for the profile screen
  const [pastOrders, setPastOrders] = useState([]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharges = 150;

  const validatePhone = (number) => {
    const pakPattern = /^03[0-4][0-9]{8}$/;
    return pakPattern.test(number);
  };

  const addItemToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        quantity: Math.max(0, item.quantity + change) 
      } : item
    ).filter(item => item.quantity > 0));
  };

  const Header = ({ title, onBack, cartCount, showProfile = false }) => (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← BACK</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title.toUpperCase()}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {showProfile && (
            <TouchableOpacity onPress={() => setCurrentScreen('profile')} style={{marginRight: 15}}>
                <Text style={{fontSize: 20}}>{userPic}</Text>
            </TouchableOpacity>
        )}
        {cartCount > 0 && (
            <View style={styles.cartCount}>
            <Text style={styles.cartCountText}>{cartCount}</Text>
            </View>
        )}
      </View>
    </View>
  );

  if (currentScreen === 'welcome') {
    return (
      <View style={[styles.container, { backgroundColor: '#e3b709' }]}>
        <View style={styles.logoCircle}>
          <Text style={{ fontSize: 40 }}>🍕</Text>
        </View>
        <Text style={styles.welcomeText}>FAST FOOD CHAIN</Text>
        <Text style={styles.brandName}>CHEEZIOUS</Text>
        
        <View style={styles.authContainer}>
          <TouchableOpacity 
            style={[styles.authBtn, styles.loginBtn]} 
            onPress={() => setCurrentScreen('login')}
          >
            <Text style={styles.loginBtnText}>LOGIN</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.authBtn, styles.guestBtn]}
            onPress={() => {
              setIsLoggedIn(false);
              setCurrentScreen('menu');
              Alert.alert("Guest Mode", "Welcome as Guest!");
            }}
          >
            <Text style={styles.guestBtnText}>CONTINUE AS GUEST</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (currentScreen === 'login') {
    return (
      <SafeAreaView style={styles.appContainer}>
        <Header title="Login" onBack={() => setCurrentScreen('welcome')} />
        <View style={styles.contentPadding}>
          <TextInput
            style={styles.inputField}
            placeholder="Phone Number (03xx-xxxxxxx)"
            keyboardType="phone-pad"
            maxLength={11}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
          />
          <TouchableOpacity 
            style={styles.payBtn}
            onPress={() => {
              if (!validatePhone(phoneNumber)) {
                Alert.alert("Invalid Number", "Please enter valid Pakistani number (03xx-xxxxxxx)");
                return;
              }
              setIsLoggedIn(true);
              setCurrentScreen('menu');
            }}
          >
            <Text style={styles.payBtnText}>LOGIN / CONTINUE</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.guestLink}
            onPress={() => setCurrentScreen('welcome')}
          >
            <Text style={styles.guestLinkText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'menu') {
    return (
      <SafeAreaView style={styles.appContainer}>
        <Header 
          title="Menu" 
          onBack={() => setCurrentScreen('welcome')}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          showProfile={true}
        />
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.menuHeaderSection}>
            <Text style={styles.mainMenuHeading}>OUR MENU</Text>
            <View style={styles.headingUnderline} />
          </View>
          
          <View style={styles.gridWrapper}>
            {menuItems.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <Text style={{fontSize: 35}}>{item.img}</Text>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.gridItemName}>{item.name}</Text>
                    <Text style={styles.gridItemPrice}>Rs. {item.price}</Text>
                </View>
                <TouchableOpacity style={styles.addSmallBtn} onPress={() => addItemToCart(item)}>
                    <Text style={styles.addBtnText}>ADD +</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {cartItems.length > 0 && (
            <TouchableOpacity 
              style={styles.cartBtn} 
              onPress={() => setCurrentScreen('cart')}
            >
              <Text style={styles.cartBtnText}>
                VIEW CART ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items) - Rs. {totalPrice}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'cart') {
    return (
      <SafeAreaView style={styles.appContainer}>
        <Header 
          title="Cart" 
          onBack={() => setCurrentScreen('menu')}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />
        <ScrollView style={styles.contentPadding}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Text style={{fontSize: 30}}>{item.img}</Text>
              <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>Rs. {item.price * item.quantity}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                    <Text style={styles.qtyBtn}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                    <Text style={styles.qtyBtn}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          
          <View style={styles.totalSection}>
            <Text style={styles.deliveryCharges}>Delivery Charges = Rs. 150</Text>
            <Text style={styles.ItemCharges}>Item Charges = Rs. {totalPrice}</Text>
            <Text style={styles.totalLabel}>TOTAL: Rs. {totalPrice + deliveryCharges}</Text>
            <TouchableOpacity 
              style={styles.checkoutBtn}
              onPress={() => setCurrentScreen('checkout')}
            >
              <Text style={styles.checkoutBtnText}>PROCEED TO CHECKOUT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'checkout') {
    return (
      <SafeAreaView style={styles.appContainer}>
        <Header title="Checkout" onBack={() => setCurrentScreen('cart')} />
        <View style={styles.contentPadding}>
          <Text style={styles.solTitle}>Choose Payment Method</Text>
          
          <ScrollView style={{maxHeight: 300}}>
            {['cod', 'easypaisa', 'jazzcash'].map((method) => (
                <TouchableOpacity 
                    key={method}
                    style={[styles.paymentOption, paymentMethod === method && styles.paymentOptionSelected]}
                    onPress={() => setPaymentMethod(method)}
                >
                    <Text style={styles.paymentOptionText}>
                        {method === 'cod' ? '💰 Cash on Delivery' : method === 'easypaisa' ? '💳 EasyPaisa' : '💳 JazzCash'}
                    </Text>
                    {paymentMethod === method && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
            ))}
          </ScrollView>

          {paymentMethod !== 'cod' && (
            <TextInput
              style={styles.inputField}
              placeholder="Payment Phone Number"
              keyboardType="phone-pad"
              maxLength={11}
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
            />
          )}

          <TouchableOpacity 
            style={styles.payBtn}
            onPress={() => {
              if (paymentMethod !== 'cod' && !validatePhone(phoneNumber)) {
                Alert.alert("Invalid Number", "Please enter valid Pakistani number");
                return;
              }
              setIsProcessing(true);
              setTimeout(() => {
                const newOrder = {
                    id: Math.random().toString(36).substr(2, 9),
                    amount: totalPrice + deliveryCharges,
                    status: 'Placed',
                    date: new Date().toLocaleDateString()
                };
                setPastOrders([newOrder, ...pastOrders]);
                setIsProcessing(false);
                setOrderPlaced(true);
                setCurrentScreen('orderSuccess');
              }, 2000);
            }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.payBtnText}>PLACE ORDER - Rs. {totalPrice + deliveryCharges}</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'orderSuccess') {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: '#1A1A1A' }]}>
        <Text style={{ fontSize: 60, marginBottom: 20 }}>✅</Text>
        <Text style={[styles.brandName, { color: '#4CAF50' }]}>ORDER CONFIRMED!</Text>
        <Text style={styles.welcomeText}>Your order has been placed successfully</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 16, marginTop: 10 }}>
          Total: Rs. {totalPrice} | {paymentMethod.toUpperCase()}
        </Text>
        <TouchableOpacity 
          style={[styles.mainBtn, { marginTop: 30 }]}
          onPress={() => {
            setCurrentScreen('menu');
            setCartItems([]);
            setPhoneNumber('');
            setPaymentMethod('cod');
          }}
        >
          <Text style={styles.mainBtnText}>NEW ORDER</Text>
        </TouchableOpacity>
      </View>
    );
  }



  if (currentScreen === 'profile') {
    return (
      <SafeAreaView style={styles.appContainer}>
        <Header title="My Profile" onBack={() => setCurrentScreen('menu')} />
        <ScrollView style={styles.contentPadding}>
          <View style={styles.profileHeader}>
            <Text style={{fontSize: 60, alignSelf: 'center'}}>{userPic}</Text>
            <Text style={styles.profileNameText}>{userName}</Text>
          </View>

          <View style={styles.editSection}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput style={styles.inputField} value={userName} onChangeText={setUserName} />
            
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput style={styles.inputField} value={userEmail} onChangeText={setUserEmail} />
            
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput style={styles.inputField} value={phoneNumber} editable={false} />
          </View>

          <Text style={[styles.solTitle, {textAlign: 'left', marginTop: 20}]}>Order Tracking</Text>
          {pastOrders.length === 0 ? (
              <Text style={{color: '#888'}}>No orders placed yet.</Text>
          ) : (
              pastOrders.map(order => (
                  <View key={order.id} style={styles.orderCard}>
                      <View>
                        <Text style={{fontWeight: 'bold'}}>Order I'd : {order.id}</Text>
                        <Text style={{fontSize: 12, color: '#666'}}>{order.date}</Text>
                      </View>
                      <View style={{alignItems: 'flex-end'}}>
                        <Text style={{color: '#FF6B00', fontWeight: 'bold'}}>Rs. {order.amount}</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{order.status}</Text>
                        </View>
                      </View>
                  </View>
              ))
          )}

          <TouchableOpacity 
            style={[styles.payBtn, {backgroundColor: '#d9534f', marginTop: 40}]}
            onPress={() => {
                setIsLoggedIn(false);
                setCartItems([]);
                setCurrentScreen('welcome');
            }}
          >
            <Text style={styles.payBtnText}>LOGOUT</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  center: { justifyContent: 'center', alignItems: 'center' },
  appContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  logoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FF6B00', justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 8 },
  welcomeText: { fontSize: 14, color: '#000000', letterSpacing: 2, fontWeight: '600', textAlign: 'center', marginBottom: 5 },
  brandName: { fontSize: 30, fontWeight: 'bold', color: '#000000', marginBottom: 40, textAlign: 'center' },
  authContainer: { marginTop: 60, paddingHorizontal: 45, width: '100%', gap: 15 },
  authBtn: { paddingVertical: 18, borderRadius: 12, alignItems: 'center', elevation: 3 },
  loginBtn: { backgroundColor: '#FF6B00' },
  guestBtn: { backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#FF6B00' },
  loginBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 },
  guestBtnText: { color: '#FF6B00', fontWeight: 'bold', fontSize: 18 },
  header: { flexDirection: 'row', padding: 15, backgroundColor: '#FF6B00', alignItems: 'center' },
  backBtn: { padding: 5 },
  backText: { color: '#FFFFFF', fontWeight: 'bold' },
  headerTitle: { flex: 1, textAlign: 'center', color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  cartCount: { backgroundColor: '#FFFFFF', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cartCountText: { color: '#FF6B00', fontWeight: 'bold', fontSize: 12 },
  scrollContainer: { flex: 1 },
  contentPadding: { flex: 1, padding: 25 },
  menuHeaderSection: { paddingHorizontal: 20, paddingVertical: 15 },
  mainMenuHeading: { fontSize: 24, fontWeight: 'bold', color: '#FF6B00', textAlign: 'center' },
  headingUnderline: { width: 60, height: 4, backgroundColor: '#FF6B00', alignSelf: 'center', marginTop: 8, borderRadius: 2 },
  gridWrapper: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between', paddingBottom: 20 },
  gridItem: { width: '48%', backgroundColor: '#FFF', borderRadius: 15, padding: 20, marginBottom: 20, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  gridItemName: { fontWeight: 'bold', marginTop: 10, color: '#1A1A1A', textAlign: 'center', fontSize: 14 },
  gridItemPrice: { color: '#FF6B00', fontSize: 16, fontWeight: 'bold', marginVertical: 8, textAlign: 'center' },
  addSmallBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: 'white', fontWeight: 'bold' },
  cartBtn: { backgroundColor: '#1A1A1A', padding: 18, borderRadius: 10, alignItems: 'center', marginHorizontal: 20, marginBottom: 20 },

  cartItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center' },
  cartItemDetails: { flex: 1, marginLeft: 15 },
  cartItemName: { fontWeight: 'bold', fontSize: 16 },
  cartItemPrice: { color: '#FF6B00', fontSize: 20, fontWeight: 'bold' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  qtyBtn: { backgroundColor: '#FF6B00', color: 'white', width: 30, height: 30, textAlign: 'center', lineHeight: 30, borderRadius: 15 },
  qtyText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15 },
  totalSection: { borderTopWidth: 2, borderTopColor: '#FF6B00', paddingTop: 20, marginTop: 20 },
  totalLabel: { fontSize: 20, fontWeight: 'bold', color: '#FF6B00', marginBottom: 10 },
  checkoutBtn: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 50 },
  checkoutBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  paymentOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderWidth: 2, borderColor: '#EEE', borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  paymentOptionSelected: { borderColor: '#FF6B00', backgroundColor: '#FFF5E6' },
  paymentOptionText: { fontSize: 16 },
  checkmark: { fontSize: 24, color: '#FF6B00' },
  inputField: { backgroundColor: '#F9F9F9', borderRadius: 10, padding: 15, borderWidth: 1, borderColor: '#DDD', marginBottom: 15 },
  payBtn: { backgroundColor: '#FF6B00', padding: 20, borderRadius: 10, alignItems: 'center' },
  payBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  solTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  profileNameText: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
  orderCard: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fdfdfd', borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  statusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5, marginTop: 5 },
  statusText: { color: '#2E7D32', fontSize: 10, fontWeight: 'bold' },
  guestLink: { marginTop: 20, alignItems: 'center' },
  guestLinkText: { color: '#FF6B00', textDecorationLine: 'underline' },
  mainBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 50, paddingVertical: 18, borderRadius: 10, alignItems: 'center' },
  mainBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});