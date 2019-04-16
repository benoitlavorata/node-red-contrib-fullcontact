# node-red-contrib-fullcontact
Provide nodes to call fullcontact API.

## fullcontact-config node
Add your api key for fullcontact

## fullcontact-execute node
Execute api calls. In msg.payload, provide two props:
- resource
- args


## Example
Input format should be:
```json
{
    payload: {
        resource: "person.enrich",
        args: {
            email: "someone@example.com"
        }
    }
}
```

Output msg.payload contains the result of your query.