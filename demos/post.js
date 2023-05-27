import { Image, StyleSheet, Text, View } from 'react-native';

function Avatar() {
    return (
        <View>
            <Image
                style={styles.avatar}
                source={{ uri: "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" }} />
        </View>
    );
}

function MyCustomComponent({ children }) {
    return (
        <View style={{ backgroundColor: 'pink' }}>{children}</View>
    )
}

/* generalise different variations of username */
function Header({ username }) {
    return (
        <MyCustomComponent style={styles.headerContainer}>
            <Avatar />
            <Text>{username}</Text>
        </MyCustomComponent>
    );
}

/* passing different properties as props */
export function Post(props) {
    const { username, image } = props;
    return (
        <View style={styles.postContainer}>
            <Header username={username} />
            <Image
                style={styles.postImage}
                source={{ uri: image }} />
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 50 / 2,
        marginRight: 10, /* add padding for better spacing */
        borderColor: 'red',
        borderWidth: 1,
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    postImage: {
        width: 200,
        height: 100,
    },

    postContainer: {
        backgroundColor: 'grey',
    },
});

