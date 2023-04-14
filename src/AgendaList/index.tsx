import { StyleSheet, Text, View, SectionList, SectionListProps } from 'react-native'
import React from 'react'

export interface AgendaListProps {
    sections: SectionListProps<any>['sections'];
}

const AgendaList: React.FC<AgendaListProps> = (props) => {
    const { sections } = props;

    const Item = (item: any) => {
        return <View style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
    };
      
      

    return (
        <View style={{backgroundColor: 'red'}}>
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => <Item title={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
            />
        </View>
    )
}

export default AgendaList

const styles = StyleSheet.create({
    item: {
        backgroundColor: "#f9c2ff",
        padding: 20,
        marginVertical: 8
      },
      header: {
        fontSize: 32,
        backgroundColor: "#fff"
      },
      title: {
        fontSize: 24
      }
})