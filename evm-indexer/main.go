package main

import (
	"log"

	"github.com/DefiantLabs/cosmos-indexer/cmd"
)

func main() {
	indexer := cmd.GetBuiltinIndexer()

	// Register TAC chain EVM message types
	err := indexer.RegisterCustomMsgTypesByTypeURLs(GetTACEVMTypeMap())
	if err != nil {
		log.Fatalf("Failed to register EVM message types. Err: %v", err)
	}

	log.Println("Registered EVM message types for TAC chain:")
	log.Println("  - /cosmos.evm.vm.v1.MsgEthereumTx")
	log.Println("  - /cosmos.evm.vm.v1.DynamicFeeTx") 
	log.Println("  - /cosmos.evm.vm.v1.LegacyTx")

	err = cmd.Execute()
	if err != nil {
		log.Fatalf("Failed to execute. Err: %v", err)
	}
}
