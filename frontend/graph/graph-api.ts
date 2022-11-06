import ensApi from 'base/network/graph/ens-api';
import didApi from 'base/network/graph/did-api';
import { store } from "business/redux/store";

export default {
    getDomainsOfOwner: async (type, wallet) => {
        switch (type) {
            case 'did':
                return await didApi.getDidDomainsOfOwner(wallet)
            case 'ens':
                return await ensApi.getEnsDomainsOfOwner(wallet)
        }
    },

    setText: async (type, address, key, value) => {
        switch (type) {
            case 'ens':
                await ensApi.setText(address, key, value)
                return;
        }
    },

    getAllTextRecords: async (type, address) => {
        switch (type) {
            case 'ens':
                return await ensApi.getAllTextRecords(address)
        }
    },
}