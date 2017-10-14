<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205523_userDataInsert extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $this->batchInsert('{{%user}}',
                           ["id", "username", "auth_key", "access_token", "password_hash", "oauth_client", "oauth_client_user_id", "email", "status", "created_at", "updated_at", "logged_at"],
                            [
    [
        'id' => '2',
        'username' => 'manager.tester',
        'auth_key' => 'bQfdrTXZGXo68Xzow7UDwoPiSZcZwMiw',
        'access_token' => 'xH-VaD7yWYnvjhMrOF6U5EWnUWheX31SaKQLNGBL',
        'password_hash' => '$2y$13$PM3RkqkfJg6K/4gASi4treK5xSuuxhDRYtAkxaZiX90PRCWejTgk2',
        'oauth_client' => null,
        'oauth_client_user_id' => null,
        'email' => 'tester2@open-ecommerce.org',
        'status' => '2',
        'created_at' => '1475138103',
        'updated_at' => '1475145153',
        'logged_at' => null,
    ],
    [
        'id' => '3',
        'username' => 'user.tester',
        'auth_key' => 'lWSZmuVDSrd_PqGq49h-ukMAAVWYoC3l',
        'access_token' => 'bAA6lnn8xTLg389oYus9-PuTpcTUpxi_ixHBkVu8',
        'password_hash' => '$2y$13$2NNAgx53BuEyF/PFozVS/.5brgWW6j.iRVEYzpXHVGT7CDGJeJ2YC',
        'oauth_client' => null,
        'oauth_client_user_id' => null,
        'email' => 'tester1@open-ecommerce.org',
        'status' => '2',
        'created_at' => '1475138103',
        'updated_at' => '1475145116',
        'logged_at' => '1481052510',
    ],
    [
        'id' => '4',
        'username' => 'mariano.marey',
        'auth_key' => '5g4luZEiPiQd2_XW20qYi1z9Ja_Wswuc',
        'access_token' => 'KUaHmJkO7sbI2tudXD66EKjUPg6wzWbRKi5VtFkK',
        'password_hash' => '$2y$13$VZRYJxgdtCKzoLLVkVua0uQ7kBUuSA4G2ZxpQezZup2.Cycl73a1C',
        'oauth_client' => null,
        'oauth_client_user_id' => null,
        'email' => 'mariano1@open-ecommerce.org',
        'status' => '2',
        'created_at' => '1475144896',
        'updated_at' => '1487933629',
        'logged_at' => '1488478751',
    ],
    [
        'id' => '5',
        'username' => 'eduardo.silva',
        'auth_key' => 'FATaN917tbMJwJ0TWZEDheYhw48kU1ba',
        'access_token' => 'SkL0rKSxvIqtxciEONWPj4S3mMxWhbss6mwnnKvp',
        'password_hash' => '$2y$13$OO8xfTcVu8tWV8YBMPXaG.up.B0j0RXkeW.CJ3I6tpd05HqVXV/zS',
        'oauth_client' => null,
        'oauth_client_user_id' => null,
        'email' => 'eduardo@open-ecommerce.org',
        'status' => '2',
        'created_at' => '1475144935',
        'updated_at' => '1475144935',
        'logged_at' => '1488479259',
    ],
    [
        'id' => '6',
        'username' => 'jim.lindsay',
        'auth_key' => 'UnqkIRl9QDigiz5-IUQvfq7968a1l_73',
        'access_token' => 'p4755jC_xB9HFJvSfk1TgPKcOIBYbnvnuGf2RLHB',
        'password_hash' => '$2y$13$W3mvG.Zk4Oh84KzS..hpQeHDG2zWhDcGMphVC.4d.5OCMQ5ra9KRG',
        'oauth_client' => null,
        'oauth_client_user_id' => null,
        'email' => 'jim@macmasters.co.uk',
        'status' => '2',
        'created_at' => '1475145029',
        'updated_at' => '1484915940',
        'logged_at' => null,
    ],
    [
        'id' => '7',
        'username' => 'jessie.sayer',
        'auth_key' => 'dpb6ZGoUTb9Nzlgi2Xnssk8wHMFHXM-t',
        'access_token' => 'fCfGqqmX92UToa9JVv8dsYAavzIPPGCfe8wXdt4f',
        'password_hash' => '$2y$13$u7HVFYnocb9iRX0CP3LPReiG0Pkx5aY6VifUCrMfleYqoVCSoiWQq',
        'oauth_client' => null,
        'oauth_client_user_id' => null,
        'email' => 'jessie@maclehose-scouts.com',
        'status' => '2',
        'created_at' => '1487784818',
        'updated_at' => '1487784981',
        'logged_at' => null,
    ],
    [
        'id' => '8',
        'username' => 'rebecca.sevadio',
        'auth_key' => 'U9i1l86KRx9A_EmS3BYd_NTVf_uLDu12',
        'access_token' => 'NXDhFSltQJX7om2O9NBj7cIgWx1bt1JZthIDn4Q5',
        'password_hash' => '$2y$13$O2kZCRlyQ.3T8laQ7s7wQuTCkmq6x2TweEaxYymDjBxlasS8RpbFW',
        'oauth_client' => null,
        'oauth_client_user_id' => null,
        'email' => 'rebecca@maclehose-scouts.com',
        'status' => '2',
        'created_at' => '1487784953',
        'updated_at' => '1487784992',
        'logged_at' => null,
    ],
    [
        'id' => '9',
        'username' => 'yolanda.pupo-thompson',
        'auth_key' => 'etrdeNaTML1mbReEBnTneM4Vy29-oBgc',
        'access_token' => 'LkxNvxNNkM98hasQnBE97p1vnouMT7eX3ijLIC0s',
        'password_hash' => '$2y$13$WGK5cuBoIyCxGVGqbLi1KO173pXetE4wK6zCY83MegNKWAN5n33W6',
        'oauth_client' => null,
        'oauth_client_user_id' => null,
        'email' => 'yolanda@maclehose-scouts.com',
        'status' => '2',
        'created_at' => '1487785046',
        'updated_at' => '1487785046',
        'logged_at' => null,
    ],
]
        );
    }

    public function safeDown()
    {
        //$this->truncateTable('{{%user}} CASCADE');
    }
}
