package main

import "encoding/json"
import "fmt"

func main() {
    //program receives one argument: the JSON object as a string
    //arg := os.Args[1]

    // unmarshal the string to a JSON object
    //var obj map[string]interface{}
    //json.Unmarshal([]byte(arg), &obj)

    // last line of stdout is the result JSON object as a string
    msg := map[string]string{"payload": ("Hallo Go")}
    msg["htmlText"] = "Hallo aus Go"
    res, _ := json.Marshal(msg)
    fmt.Println(string(res))
}