/**
 * Created by ajaygaur on 25/06/17.
 */

const lookupRequestBuilder = {
  idLookup: (lookupType, keys, filters = []) => ({
    extraParams: { filters },
    lookupType,
    keys,
  }),

  dimensionsLookup: (params) => {
    const { filters = [], lookupType, pageObject: {page, size = 10}, query, additional = {}} = params;

    return {
      filters,
      dimensionLookupRequests: {
        lookupType,
        query,
        additional,
        page: {
          page,
          size,
        },
      },
    };
  },
};

const requestBuilders = {
  lookupRequestBuilder,
};

export default requestBuilders;
