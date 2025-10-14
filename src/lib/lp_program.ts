/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lp_program.json`.
 */
export type LpProgram = {
  "address": "Ec4AkMDHHTf37m7KUuJi63x7x3KawbisTqS8XfLAXmdY",
  "metadata": {
    "name": "lpProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "applyToJob",
      "discriminator": [
        0,
        252,
        167,
        244,
        145,
        90,
        227,
        29
      ],
      "accounts": [
        {
          "name": "application",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  112,
                  112,
                  108,
                  105,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "jobPost"
              },
              {
                "kind": "account",
                "path": "freelancer"
              }
            ]
          }
        },
        {
          "name": "freelancer",
          "writable": true,
          "signer": true
        },
        {
          "name": "jobPost"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "resumeLink",
          "type": "string"
        },
        {
          "name": "expectedEndDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "approveApplication",
      "discriminator": [
        136,
        47,
        9,
        33,
        208,
        120,
        226,
        157
      ],
      "accounts": [
        {
          "name": "application",
          "writable": true
        },
        {
          "name": "jobPost",
          "writable": true
        },
        {
          "name": "client",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "approveSubmission",
      "discriminator": [
        154,
        76,
        116,
        120,
        143,
        128,
        16,
        205
      ],
      "accounts": [
        {
          "name": "application",
          "writable": true
        },
        {
          "name": "jobPost",
          "writable": true
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "jobPost"
              }
            ]
          }
        },
        {
          "name": "client",
          "writable": true,
          "signer": true
        },
        {
          "name": "freelancer",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "clientReview",
          "type": "string"
        }
      ]
    },
    {
      "name": "cancelJob",
      "discriminator": [
        126,
        241,
        155,
        241,
        50,
        236,
        83,
        118
      ],
      "accounts": [
        {
          "name": "jobPost",
          "writable": true
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "jobPost"
              }
            ]
          }
        },
        {
          "name": "client",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeJobPost",
      "discriminator": [
        179,
        212,
        183,
        5,
        92,
        58,
        110,
        101
      ],
      "accounts": [
        {
          "name": "jobPost",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  106,
                  111,
                  98,
                  95,
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "client"
              },
              {
                "kind": "arg",
                "path": "title"
              }
            ]
          }
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "jobPost"
              }
            ]
          }
        },
        {
          "name": "client",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "startDate",
          "type": "i64"
        },
        {
          "name": "endDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "submitWork",
      "discriminator": [
        158,
        80,
        101,
        51,
        114,
        130,
        101,
        253
      ],
      "accounts": [
        {
          "name": "application",
          "writable": true
        },
        {
          "name": "freelancer",
          "writable": true,
          "signer": true
        },
        {
          "name": "jobPost"
        }
      ],
      "args": [
        {
          "name": "submissionLink",
          "type": "string"
        },
        {
          "name": "narration",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "application",
      "discriminator": [
        219,
        9,
        27,
        113,
        208,
        126,
        203,
        30
      ]
    },
    {
      "name": "jobPost",
      "discriminator": [
        209,
        251,
        190,
        205,
        19,
        180,
        151,
        8
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "jobAlreadyFilled",
      "msg": "This job has already been filled."
    },
    {
      "code": 6002,
      "name": "applicationNotApproved",
      "msg": "Application has not been approved yet."
    },
    {
      "code": 6003,
      "name": "workNotCompleted",
      "msg": "Work has not been completed yet."
    },
    {
      "code": 6004,
      "name": "invalidDates",
      "msg": "Invalid dates provided."
    },
    {
      "code": 6005,
      "name": "invalidInput",
      "msg": "Invalid input provided."
    },
    {
      "code": 6006,
      "name": "invalidAccount",
      "msg": "Invalid account relationship."
    },
    {
      "code": 6007,
      "name": "invalidAmount",
      "msg": "Invalid amount provided."
    },
    {
      "code": 6008,
      "name": "jobCancelled",
      "msg": "Job has been cancelled."
    },
    {
      "code": 6009,
      "name": "jobAlreadyCancelled",
      "msg": "Job has already been cancelled."
    },
    {
      "code": 6010,
      "name": "workAlreadySubmitted",
      "msg": "Work has already been submitted."
    },
    {
      "code": 6011,
      "name": "applicationAlreadyApproved",
      "msg": "Application has already been approved."
    }
  ],
  "types": [
    {
      "name": "application",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "applicant",
            "type": "pubkey"
          },
          {
            "name": "jobPost",
            "type": "pubkey"
          },
          {
            "name": "resumeLink",
            "type": "string"
          },
          {
            "name": "submissionLink",
            "type": "string"
          },
          {
            "name": "narration",
            "type": "string"
          },
          {
            "name": "clientReview",
            "type": "string"
          },
          {
            "name": "approved",
            "type": "bool"
          },
          {
            "name": "completed",
            "type": "bool"
          },
          {
            "name": "expectedEndDate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "jobPost",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "client",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "isFilled",
            "type": "bool"
          },
          {
            "name": "cancelled",
            "type": "bool"
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "endDate",
            "type": "i64"
          },
          {
            "name": "escrowBump",
            "type": "u8"
          },
          {
            "name": "freelancer",
            "type": {
              "option": "pubkey"
            }
          }
        ]
      }
    }
  ]
};
