<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210749_user extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%user}}',
            [
                'id'=> $this->primaryKey(11),
                'username'=> $this->string(32)->null()->defaultValue(null),
                'auth_key'=> $this->string(32)->notNull(),
                'access_token'=> $this->string(40)->notNull(),
                'password_hash'=> $this->string(255)->notNull(),
                'oauth_client'=> $this->string(255)->null()->defaultValue(null),
                'oauth_client_user_id'=> $this->string(255)->null()->defaultValue(null),
                'email'=> $this->string(255)->notNull(),
                'status'=> $this->smallInteger(6)->notNull()->defaultValue(2),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
                'updated_at'=> $this->integer(11)->null()->defaultValue(null),
                'logged_at'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%user}}');
    }
}
